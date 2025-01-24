export const robotCategory = {
    kind: 'category',
    name: 'Robot',
    categorystyle: 'procedure_category',
    contents: [
        {
            kind: 'category',
            name: 'MecanumDrive',
            categorystyle: 'procedure_category',
            contents: [
                {
                    "kind": "block",
                    "type": "mrc_call_robot_method",
                    "fields": { "MECHANISM": "robot.mecanumDrive", "METHOD": "drive" },
                    "extraState": {
                        "returnType": "None",
                        "args": [{ "name": "forwardSpeed", "type": "float" }, { "name": "strafeRightSpeed", "type": "float" }, { "name": "rotateSpeed", "type": "float" }],
                        "tooltip": "",
                    },

                    "inputs": {
                        "ARG0": { "shadow": { "type": "math_number", "fields": { "NUM": 1 } } },
                        "ARG1": { "shadow": { "type": "math_number", "fields": { "NUM": 0 } } },
                        "ARG2": { "shadow": { "type": "math_number", "fields": { "NUM": 0 } } },
                    }

                },
                {
                    "kind": "block",
                    "type": "mrc_call_robot_method",
                    "fields": { "MECHANISM": "robot.mecanumDrive", "METHOD": "drive_to_position" },
                    "extraState": {
                        "returnType": "None",
                        "args": [{ "name": "x_inches", "type": "float" }, { "name": "y_inches", "type": "float" }, { "name": "heading_degrees", "type": "float" }],
                        "tooltip": "",
                    },
                    "inputs": {
                        "ARG0": { "shadow": { "type": "math_number", "fields": { "NUM": 10 } } },
                        "ARG1": { "shadow": { "type": "math_number", "fields": { "NUM": 0 } } },
                        "ARG2": { "shadow": { "type": "math_number", "fields": { "NUM": 0 } } },
                    }
                }
            ]
        },
        {
            kind: 'category',
            name: 'Arm',
            categorystyle: 'procedure_category',
            contents: [
                {
                    "kind": "block",
                    "type": "mrc_call_robot_method",
                    "fields": { "MECHANISM": "robot.arm", "METHOD": "up" },
                    "extraState": {
                        "returnType": "None",
                        "args": [{ "name": "amount", "type": "float" }],
                        "tooltip": "",
                    },
                    "inputs": {
                        "ARG0": { "shadow": { "type": "math_number", "fields": { "NUM": 100 } } },
                    }
                },
                {
                    "kind": "block",
                    "type": "mrc_call_robot_method",
                    "fields": { "MECHANISM": "robot.arm", "METHOD": "down" },
                    "extraState": {
                        "returnType": "None",
                        "args": [{ "name": "amount", "type": "float" }],
                        "tooltip": "",
                    },
                    "inputs": {
                        "ARG0": { "shadow": { "type": "math_number", "fields": { "NUM": 100 } } },
                    }
                },
                {
                    "kind": "block",
                    "type": "mrc_call_robot_method",
                    "fields": { "MECHANISM": "robot.arm", "METHOD": "go_to_position" },
                    "extraState": {
                        "functionKind": "instance",
                        "returnType": "None",
                        "args": [{ "name": "position", "type": "float" }],
                        "tooltip": "",
                    },
                    "inputs": {
                        "ARG0": { "shadow": { "type": "math_number", "fields": { "NUM": 1000 } } },
                    }
                },
                {
                    "kind": "block",
                    "type": "mrc_call_robot_method",
                    "fields": { "MECHANISM": "robot.arm", "METHOD": "reset_position" },
                    "extraState": {
                        "returnType": "None",
                        "args": [],
                        "tooltip": "",
                    },
                    "inputs": {}
                },
                {
                    "kind": "block",
                    "type": "mrc_call_robot_method",
                    "fields": { "MECHANISM": "robot.arm", "METHOD": "get_position" },                    
                    "extraState": {
                        "functionKind": "instance",
                        "returnType": "float",
                        "args": [],
                        "tooltip": "",
                    },
                    "inputs": {}
                }
            ]
        }
    ]
}