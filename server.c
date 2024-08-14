#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <winsock2.h>
#include <windows.h>

#pragma comment(lib, "ws2_32.lib") // Link with ws2_32.lib for Winsock functions
#pragma comment(lib, "iphlpapi.lib")

#define BUFFER_SIZE 255

void error(const char *msg) {
    perror(msg);
    exit(1);
}

void clear_buffer(char *buffer, size_t size) {
    memset(buffer, '\0', size);
}

int main(int argc, char *argv[]) {
    WSADATA wsaData;
    if (argc < 2) {
        fprintf(stderr, "Port number not provided. Program terminated.\n");
        return 1;
    }

    SOCKET socket_fd, new_socket_fd;
    int port_number, n;
    char buffer[BUFFER_SIZE];
    struct sockaddr_in server_addr, client_addr;
    int client_len = sizeof(client_addr);

    // Initialize Winsock
    if (WSAStartup(MAKEWORD(2, 2), &wsaData) != 0) {
        printf("WSAStartup failed.\n");
        return 1;
    }

    // Create a socket
    socket_fd = socket(AF_INET, SOCK_STREAM, 0);
    if (socket_fd == INVALID_SOCKET) {
        printf("Error opening socket: %d\n", WSAGetLastError());
        WSACleanup();
        return 1;
    }

    // Set up the server address
    port_number = atoi(argv[1]);
    server_addr.sin_family = AF_INET;
    server_addr.sin_addr.s_addr = INADDR_ANY;
    server_addr.sin_port = htons(port_number);
    clear_buffer(buffer, BUFFER_SIZE);

    // Bind the socket
    if (bind(socket_fd, (struct sockaddr *)&server_addr, sizeof(server_addr)) == SOCKET_ERROR) {
        printf("Error on binding: %d\n", WSAGetLastError());
        closesocket(socket_fd);
        WSACleanup();
        return 1;
    }

    // Listen for incoming connections
    if (listen(socket_fd, 5) == SOCKET_ERROR) {
        printf("Error on listen: %d\n", WSAGetLastError());
        closesocket(socket_fd);
        WSACleanup();
        return 1;
    }

    // Accept a connection
    new_socket_fd = accept(socket_fd, (struct sockaddr *)&client_addr, &client_len);
    if (new_socket_fd == INVALID_SOCKET) {
        printf("Error on accept: %d\n", WSAGetLastError());
        closesocket(socket_fd);
        WSACleanup();
        return 1;
    }

    printf("Server: Connection established\n");

    while (1) {
        clear_buffer(buffer, BUFFER_SIZE);
        n = recv(new_socket_fd, buffer, BUFFER_SIZE - 1, 0);
        if (n == SOCKET_ERROR) {
            printf("Error reading from socket: %d\n", WSAGetLastError());
            break;
        } else if (n == 0) {
            printf("Client disconnected\n");
            break;
        }

        buffer[n] = '\0'; // Null-terminate the buffer
        printf("Client: %s\n", buffer);

        clear_buffer(buffer, BUFFER_SIZE);
        if (fgets(buffer, BUFFER_SIZE - 1, stdin) != NULL) {
            // Remove newline character from input if present
            buffer[strcspn(buffer, "\n")] = '\0';
            n = send(new_socket_fd, buffer, strlen(buffer), 0);
            if (n == SOCKET_ERROR) {
                printf("Error writing to socket: %d\n", WSAGetLastError());
                break;
            }
            if (strncmp("Bye", buffer, 3) == 0) {
                break;
            }
        } else {
            printf("Error reading from stdin\n");
            break;
        }
    }

    closesocket(new_socket_fd);
    closesocket(socket_fd);
    WSACleanup();
    return 0;
}
