/**
 * @license
 * Copyright 2024 Porpoiseful LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @author alan@porpoiseful.com (Alan Smith)
 */


import * as Blockly from 'blockly';
import { Order, PythonGenerator } from 'blockly/python';

import { createFieldNonEditableText } from '../fields/FieldNonEditableText';
import { getAllowedTypesForSetCheck, getOutputCheck, addImport } from './utils/python';


import { MRC_STYLE_FUNCTIONS } from '../themes/styles'

// A block to call a python function.

export const BLOCK_NAME = 'mrc_call_robot_method';

const RETURN_TYPE_NONE = 'None';

export type FunctionArg = {
    name: string,
    type: string,
 };

type CallRobotMethodBlock = Blockly.Block & CallRobotMethodMixin;
interface CallRobotMethodMixin extends CallRobotMethodMixinType {
  mrcReturnType: string,
  mrcArgs: FunctionArg[],
  mrcTooltip: string,
}
type CallRobotMethodMixinType = typeof CALL_ROBOT_METHOD;

/** Extra state for serialising call_python_* blocks. */
type CallRobotMethodExtraState = {
  /**
   * The return type of the function.
   * Use 'None' for no return value.
   * Use '' for an untyped return value.
   */
  returnType: string,
  /**
   * The arguments of the function.
   * For instance methods, args[0].name is the self label and args[0].type is
   * the self type.
   */
  args: FunctionArg[],
  /**
   * Specified for a custom tooltip.
   */
  tooltip?: string,
};

const CALL_ROBOT_METHOD = {
  /**
   * Block initialization.
   */
  init: function(this: CallRobotMethodBlock): void {
    this.setStyle(MRC_STYLE_FUNCTIONS);
    this.setTooltip(() => {
      let tooltip: string;
      const className = this.getFieldValue('MECHANISM');
      const functionName = this.getFieldValue('METHOD');
      
      const funcTooltip = this.mrcTooltip;
      tooltip = 'Calls the function ' + className + '.' + functionName + '.';
      if (funcTooltip) {
        tooltip += '\n\n' + funcTooltip;
      }
      return tooltip;
    });
  },
  /**
   * Returns the state of this block as a JSON serializable object.
   */
  saveExtraState: function(
      this: CallRobotMethodBlock): CallRobotMethodExtraState {
    const extraState: CallRobotMethodExtraState = {
      returnType: this.mrcReturnType,
      args: [],
    };
    this.mrcArgs.forEach((arg) => {
      extraState.args.push({
        'name': arg.name,
        'type': arg.type,
      });
    });
    if (this.mrcTooltip) {
      extraState.tooltip = this.mrcTooltip;
    }
    return extraState;
  },
  /**
   * Applies the given state to this block.
   */
  loadExtraState: function(
      this: CallRobotMethodBlock,
      extraState: CallRobotMethodExtraState
  ): void {
    this.mrcReturnType = extraState.returnType;
    this.mrcArgs = [];
    extraState.args.forEach((arg) => {
      this.mrcArgs.push({
        'name': arg.name,
        'type': arg.type,
      });
    });
    this.mrcTooltip = extraState.tooltip ? extraState.tooltip : '';
    this.updateBlock_();
  },
  /**
   * Update the block to reflect the newly loaded extra state.
   */
  updateBlock_: function(this: CallRobotMethodBlock): void {
    if (this.mrcReturnType !== RETURN_TYPE_NONE) {
      // Set the output plug.
      this.setPreviousStatement(false, null);
      this.setNextStatement(false, null);
      const outputCheck = getOutputCheck(this.mrcReturnType);
      if (outputCheck) {
        this.setOutput(true, outputCheck);
      } else {
        this.setOutput(true);
      }
    } else {
      // No output plug.
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setOutput(false);
    }
    // Add the dummy input.
    this.appendDummyInput()
    .appendField('call')
    .appendField(createFieldNonEditableText(''), 'MECHANISM')
    .appendField('.')
    .appendField(createFieldNonEditableText(''), 'METHOD');

    // Add input sockets for the arguments.
    for (let i = 0; i < this.mrcArgs.length; i++) {
      const input = this.appendValueInput('ARG' + i)
          .setAlign(Blockly.inputs.Align.RIGHT)
          .appendField(this.mrcArgs[i].name);
      if (this.mrcArgs[i].type) {
        input.setCheck(getAllowedTypesForSetCheck(this.mrcArgs[i].type));
      }
    }
  }
};

export const setup = function() {
  Blockly.Blocks[BLOCK_NAME] = CALL_ROBOT_METHOD;
};

export const pythonFromBlock = function(
    block: Blockly.Block,
    generator: PythonGenerator,
) {
  const callRobotMethodBlock = block as CallRobotMethodBlock;
  let code;

  const mechanismValue = block.getFieldValue('MECHANISM')
  const functionName = block.getFieldValue('METHOD');
  code = mechanismValue + '.' + functionName;
  
  code += '(' + generateCodeForArguments(callRobotMethodBlock, generator) + ')';
  if (block.outputConnection) {
    return [code, Order.FUNCTION_CALL];
  } else {
    return code + ';\n';
  }
};

function generateCodeForArguments(
    block: CallRobotMethodBlock,
    generator: PythonGenerator) {
  let code = '';
  if (block.mrcArgs.length === 1) {
    code += generator.valueToCode(block, 'ARG0', Order.NONE) || 'None';
  } else {
    let delimiter = '\n' + generator.INDENT + generator.INDENT;
    for (let i = 0; i < block.mrcArgs.length; i++) {
      code += delimiter;
      code += generator.valueToCode(block, 'ARG' + i, Order.NONE) || 'None';
      delimiter = ',\n' + generator.INDENT + generator.INDENT;
    }
  }
  return code;
}
