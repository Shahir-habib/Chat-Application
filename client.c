#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <winsock2.h>
#include <windows.h>

#pragma comment(lib, "ws2_32.lib") // Link with ws2_32.lib for Winsock functions
#pragma comment(lib, "iphlpapi.lib")

#define BUFFER_SIZE 255

void error(const char *msg) {
    fprintf(stderr, "%s: %d\n", msg, WSAGetLastError());
    exit(1);
}

void clear_buffer(char *buffer, size_t size) {
    memset(buffer, '\0', size);
}

int main(int argc, char *argv[]) {
    WSADATA wsaData;
    SOCKET socket_fd;
    struct sockaddr_in server_addr;
    struct hostent *server;
    int port_number, n;
    char buffer[BUFFER_SIZE], rebuffer[BUFFER_SIZE];

    if (argc < 3) {
        fprintf(stderr, "Usage: %s hostname port\n", argv[0]);
        return 1;
    }

    // Initialize Winsock
    if (WSAStartup(MAKEWORD(2, 2), &wsaData) != 0) {
        printf("WSAStartup failed.\n");
        return 1;
    }

    // Create a socket
    port_number = atoi(argv[2]);
    socket_fd = socket(AF_INET, SOCK_STREAM, IPPROTO_TCP);
    if (socket_fd == INVALID_SOCKET) {
        error("Error opening socket");
    }

    // Resolve the hostname
    server = gethostbyname(argv[1]);
    if (server == NULL) {
        fprintf(stderr, "Error, no such host\n");
        closesocket(socket_fd);
        WSACleanup();
        return 1;
    }

    // Set up the server address
    server_addr.sin_family = AF_INET;
    memcpy(&server_addr.sin_addr.s_addr, server->h_addr, server->h_length);
    server_addr.sin_port = htons(port_number);
    clear_buffer(buffer, BUFFER_SIZE);

    // Connect to the server
    if (connect(socket_fd, (struct sockaddr *) &server_addr, sizeof(server_addr)) == SOCKET_ERROR) {
        error("Error connecting");
    }

    // Send and receive data
    while (1) {
        clear_buffer(buffer, BUFFER_SIZE);
        clear_buffer(rebuffer, BUFFER_SIZE);

        // Get input from the user
        if (fgets(buffer, sizeof(buffer), stdin) == NULL) {
            printf("Error reading from stdin\n");
            break;
        }
        // Remove the newline character
        buffer[strcspn(buffer, "\n")] = '\0';

        // Send the message to the server
        if (send(socket_fd, buffer, strlen(buffer), 0) == SOCKET_ERROR) {
            error("Error writing to socket");
        }

        if (strncmp("Bye", buffer, 3) == 0) {
            break;
        }

        // Receive a response from the server
        n = recv(socket_fd, rebuffer, sizeof(rebuffer) - 1, 0);
        if (n == SOCKET_ERROR) {
            error("Error reading from socket");
        } else if (n == 0) { // Connection closed
            printf("Server closed the connection.\n");
            break;
        }
        rebuffer[n] = '\0'; // Null-terminate the received data
        printf("Server: %s\n", rebuffer);
    }

    closesocket(socket_fd);
    WSACleanup();
    return 0;
}
