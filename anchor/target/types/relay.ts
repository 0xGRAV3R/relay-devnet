export type Relay = {
  "version": "0.1.0",
  "name": "relay",
  "instructions": [
    {
      "name": "createRelayEntry",
      "accounts": [
        {
          "name": "relayEntry",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "title",
          "type": "string"
        },
        {
          "name": "message",
          "type": "string"
        },
        {
          "name": "recipient",
          "type": "string"
        },
        {
          "name": "enc",
          "type": "bool"
        }
      ]
    },
    {
      "name": "updateRelayEntry",
      "accounts": [
        {
          "name": "relayEntry",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "title",
          "type": "string"
        },
        {
          "name": "message",
          "type": "string"
        },
        {
          "name": "recipient",
          "type": "string"
        },
        {
          "name": "enc",
          "type": "bool"
        }
      ]
    },
    {
      "name": "deleteRelayEntry",
      "accounts": [
        {
          "name": "relayEntry",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "title",
          "type": "string"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "relayEntryState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "title",
            "type": "string"
          },
          {
            "name": "message",
            "type": "string"
          },
          {
            "name": "recipient",
            "type": "string"
          },
          {
            "name": "enc",
            "type": "bool"
          }
        ]
      }
    }
  ]
};

export const IDL: Relay = {
  "version": "0.1.0",
  "name": "relay",
  "instructions": [
    {
      "name": "createRelayEntry",
      "accounts": [
        {
          "name": "relayEntry",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "title",
          "type": "string"
        },
        {
          "name": "message",
          "type": "string"
        },
        {
          "name": "recipient",
          "type": "string"
        },
        {
          "name": "enc",
          "type": "bool"
        }
      ]
    },
    {
      "name": "updateRelayEntry",
      "accounts": [
        {
          "name": "relayEntry",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "title",
          "type": "string"
        },
        {
          "name": "message",
          "type": "string"
        },
        {
          "name": "recipient",
          "type": "string"
        },
        {
          "name": "enc",
          "type": "bool"
        }
      ]
    },
    {
      "name": "deleteRelayEntry",
      "accounts": [
        {
          "name": "relayEntry",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "title",
          "type": "string"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "relayEntryState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "title",
            "type": "string"
          },
          {
            "name": "message",
            "type": "string"
          },
          {
            "name": "recipient",
            "type": "string"
          },
          {
            "name": "enc",
            "type": "bool"
          }
        ]
      }
    }
  ]
};
