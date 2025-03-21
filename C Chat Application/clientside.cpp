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
#define SERVER_IP "127.0.0.1" // IP address of the server

void error(const char *msg)
{
    perror(msg);
    exit(1);
}
int main(int argc, char *argv[])
{
    WSADATA wsaData;
    if (argc < 4)
    {
        fprintf(stderr, "usage %s hostname port file_name\n", argv[0]);
        exit(1);
    }
    int socket_fd, port_number, n;
    char buffer[32], rebuffer[32];
    struct sockaddr_in server_addr;
    struct hostent *server;
    SOCKET clientSocket = INVALID_SOCKET;

    // Initialize Winsock
    if (WSAStartup(MAKEWORD(2, 2), &wsaData) != 0)
    {
        printf("WSAStartup failed.\n");
        return 1;
    }

    // Create a socket
    port_number = atoi(argv[2]);
    socket_fd = socket(AF_INET, SOCK_STREAM, IPPROTO_TCP);
    if (socket_fd < 0)
    {
        error("Error opening socket");
    }
    server = gethostbyname(argv[1]);
    if (server == NULL)
    {
        fprintf(stderr, "Error, no such host\n");
        exit(0);
    }

    // Set up the server address
    server_addr.sin_family = AF_INET;
    strncpy((char *)server->h_addr, (char *)&server_addr.sin_addr.s_addr, server->h_length);
    server_addr.sin_port = htons(port_number);
    server_addr.sin_addr.s_addr = inet_addr(SERVER_IP);
    CLEAR(buffer);

    // Connect to the server
    if (connect(socket_fd, (struct sockaddr *)&server_addr, sizeof(server_addr)) < 0)
    {
        error("Error connecting");
    }

    FILE *file = fopen(argv[3], "rb");
    if (file == NULL)
    {
        error("Error opening file");
    }
    char ch ;
    while((ch = fgetc(file)) != EOF)
    {
        send(socket_fd, &ch, 1, 0);
    }
    fclose(file);
    cout<<"File sent successfully \n";
    closesocket(socket_fd);
    WSACleanup();
    return 0;
}