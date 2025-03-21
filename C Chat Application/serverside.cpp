
#define CLEAR(x) memset(x, '\0', 255)
#include <bits/stdc++.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/types.h>
#include <winsock2.h>
#include <windows.h>
using namespace std;
#pragma comment(lib, "ws2_32.lib") // Link with ws2_32.lib for Winsock functions
#pragma comment(lib, "iphlpapi.lib")
void error(const char *msg)
{
    perror(msg);
    exit(1);
}
int main(int argc, char *argv[])
{
    WSADATA wsaData;
    if (argc < 2)
    {
        fprintf(stderr, "Port number not provided. Program terminated.\n");
        exit(1);
    }
    int socket_fd, new_socket_fd, port_number, n;
    char buffer[32];
    struct sockaddr_in server_addr, client_addr;

    // Initialize Winsock
    if (WSAStartup(MAKEWORD(2, 2), &wsaData) != 0)
    {
        printf("WSAStartup failed.\n");
        return 1;
    }

    // Create a socket
    socket_fd = socket(AF_INET, SOCK_STREAM, 0);
    if (socket_fd < 0)
    {
        error("Error opening socket");
    }

    // Set up the server address
    port_number = atoi(argv[1]);
    server_addr.sin_family = AF_INET;
    server_addr.sin_addr.s_addr = INADDR_ANY;
    server_addr.sin_port = htons(port_number);
    CLEAR(buffer);

    // Bind the socket
    if (bind(socket_fd, (struct sockaddr *)&server_addr, sizeof(server_addr)) < 0)
    {
        error("Error on binding");
        closesocket(socket_fd);
        WSACleanup();
        return 1;
    }
    // Listen for incoming connections
    listen(socket_fd, 5);
    int client_len = sizeof(client_addr);

    // Accept a connection
    new_socket_fd = accept(socket_fd, (struct sockaddr *)&client_addr, &client_len);
    if (new_socket_fd < 0)
    {
        error("Error on accept");
    }
    printf("Server: Connection established\n");

    // Receive data from the client
    FILE *file = fopen("received.txt", "w");
    int c=0;
    while (1)
    {
        n = recv(new_socket_fd, buffer, 32, 0);
        if (n < 0)
        {
            error("Error reading from socket");
        }
        if (n == 0)
        {
            break;
        }
        fwrite(buffer, 1, n, file);
        c++;
    }
    fclose(file);
    file = fopen("received.txt", "r");
    fclose(file);
    printf("File received successfully\n");
    closesocket(new_socket_fd);
    closesocket(socket_fd);
    WSACleanup();
    return 0;
}