This Project is for simulating the chatting between two users on same local area network.
The project is implemented using  socket programming in C.
A server and a client are created and the server listens for incoming connections from the client.
The client sends the message to the server and the server receives the message and displays it.
The server then sends the message to the client and the client receives the message and displays it.
The chatting continues until the user types "bye" to end the chat.

## How to run the project
1. Open the terminal and navigate to the directory where the project is saved.
2. Compile the server.c file using the following command:
```bash
gcc server.c -o server -lws2_32
```
3. Compile the client.c file using the following command:
```bash
gcc client.c -o client -lws2_32
```
4. Run the server using the following command:
```bash
./server <port_number>
```
5. Run the client using the following command:
```bash
./client <server_ip> <port_number>
```
6. Start chatting between the client and the server.
7. To end the chat, type "bye" in the client terminal.


## File Transfers Application
The project also includes a file transfer application where the client can send a file to the server.
The client sends the file to the server and the server receives the file and saves it in the current directory.

## How to run the file transfer application
1. Open the terminal and navigate to the directory where the project is saved.
2. Compile the server.c file using the following command:
```bash
gcc server.c -o server -lws2_32
```
3. Compile the client_file_transfer.c file using the following command:
```bash
gcc client_file_transfer.c -o client_file_transfer -lws2_32
```
4. Run the server using the following command:
```bash
./server <port_number>
```
5. Run the client using the following command:
```bash
./client_file_transfer <server_ip> <port_number>
```
6. Enter the file name that you want to send to the server.
7. The server will receive the file and save it in the current directory.
