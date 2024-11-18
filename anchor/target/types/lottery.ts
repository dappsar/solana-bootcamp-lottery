/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/lottery.json`.
 */
export type Lottery = {
  "address": "Hve87o7ETbTkEXBhnJ6VYZ7d4kBdHhfbZ2PLAYKbZ8Ta",
  "metadata": {
    "name": "lottery",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "lotteryBuyTicket",
      "discriminator": [
        120,
        41,
        185,
        255,
        30,
        115,
        215,
        140
      ],
      "accounts": [
        {
          "name": "bingoAccount",
          "writable": true
        },
        {
          "name": "winners",
          "writable": true
        },
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "chosenNumber",
          "type": "u8"
        }
      ]
    },
    {
      "name": "lotteryClaimReward",
      "discriminator": [
        164,
        95,
        115,
        205,
        205,
        185,
        52,
        9
      ],
      "accounts": [
        {
          "name": "bingoAccount",
          "writable": true
        },
        {
          "name": "winners",
          "writable": true
        },
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "ticketNumber",
          "type": "u8"
        }
      ]
    },
    {
      "name": "lotteryInitialize",
      "discriminator": [
        141,
        238,
        202,
        117,
        157,
        190,
        49,
        240
      ],
      "accounts": [
        {
          "name": "bingoAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  98,
                  105,
                  110,
                  103,
                  111,
                  95,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "winners",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  119,
                  105,
                  110,
                  110,
                  101,
                  114,
                  115,
                  95,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "bingoAccount",
      "discriminator": [
        32,
        246,
        219,
        220,
        244,
        135,
        218,
        11
      ]
    },
    {
      "name": "winners",
      "discriminator": [
        124,
        173,
        245,
        175,
        40,
        115,
        199,
        91
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "alreadyInitialized",
      "msg": "The game has already been initialized."
    },
    {
      "code": 6001,
      "name": "uninitialized",
      "msg": "The game is not initialized."
    },
    {
      "code": 6002,
      "name": "numberNotAvailable",
      "msg": "The chosen number is not available."
    },
    {
      "code": 6003,
      "name": "numberAlreadyTaken",
      "msg": "The number is already taken."
    },
    {
      "code": 6004,
      "name": "notAWinner",
      "msg": "You are not a winner."
    },
    {
      "code": 6005,
      "name": "insufficientLamports",
      "msg": "Insufficient lamports for the transaction."
    }
  ],
  "types": [
    {
      "name": "bingoAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "tickets",
            "type": {
              "vec": {
                "defined": {
                  "name": "ticket"
                }
              }
            }
          },
          {
            "name": "initialized",
            "type": "bool"
          },
          {
            "name": "counter",
            "type": "i8"
          }
        ]
      }
    },
    {
      "name": "ticket",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "number",
            "type": "u8"
          },
          {
            "name": "user",
            "type": {
              "option": "pubkey"
            }
          }
        ]
      }
    },
    {
      "name": "winners",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "keys",
            "type": {
              "vec": {
                "defined": {
                  "name": "ticket"
                }
              }
            }
          }
        ]
      }
    }
  ]
};
