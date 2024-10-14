# WeChat API Fuzzer

This repository contains tools for analyzing and dynamically invoking WeChat Miniapp APIs. The goal is to evaluate how miniapp APIs perform by leveraging the debugging protocol of WeChat.

## Overview

The main code is located in the `Evalulate-WeChat` folder. It leverages WeChat's devtools to execute miniapp APIs dynamically using the Chrome debugger protocol. Specifically, the code reverse engineers and customizes the WeChat debugging protocol to invoke APIs on targeted platforms.

### Directories and their purposes:

#### Evalulate-WeChat

- **Purpose**: This is the core folder where the reverse-engineered WeChat debug protocol is implemented. It allows the evaluation of JavaScript miniapp APIs directly through the `evaluate` function in the debug protocol.
- **Key Files**:
  - `evaluateParameters.js`: Implements the functionality for dynamically invoking miniapp APIs using WeChat's debug protocol.
  - `evaluateImproved.js`, `evaluateNew.js`: Variations of the evaluation script, likely for experimentation and improvement purposes.
  - `invariantApis.csv`: List of APIs that are invariant across executions.
  - `undoc.json`: JSON containing undocumented APIs.

#### Eval-Output

- **Purpose**: This folder stores the evaluation results, showing which APIs successfully ran and which ones generated errors.
- **Key Files**:
  - `accessdenied.csv`, `catch.csv`, `df_other.csv`, `other.csv`: CSV files recording the API responses, such as denied access or errors caught during execution.
  - `test.ipynb`: A Jupyter notebook, possibly used for analyzing the output.

#### Fill-Parameters

- **Purpose**: This folder contains scripts to fill in the required parameters for miniapp APIs based on static analysis of the APIs.
- **Key Files**:
  - `WechatApisParaupdated.csv`, `WechatApisParaupdatedREQ.csv`: CSV files containing WeChat APIs and their required parameters.
  - `WechatApisParaupdated_template.txt`: Template used to fill parameters with default values in a templated approach.

#### WeChat-Miniapps-APIs

- **Purpose**: This folder contains data and configurations related to the WeChat Miniapp APIs.
- **Key Files**:
  - `WechatApisParaupdated.csv`: CSV file containing updated parameters for WeChat APIs.
  - `undocStrict.json`: JSON file likely containing undocumented APIs that require stricter handling.

## Usage

### Evaluate Parameters:

The `evaluateParameters.js` file in the `Evalulate-WeChat` folder is the primary entry point. It feeds JavaScript code into the WeChat debug protocol and logs the output.

### Filling Parameters:

The scripts in the `Fill-Parameters` folder take the WeChat APIs and their required parameters (from CSV files) and fill them using default parameters, following a templated approach.

### API Evaluation:

After dynamically invoking the APIs, the results are stored in the `Eval-Output` folder. The CSV files record successful invocations and errors encountered during execution.

## CSV File Explanations

- **invariantApis.csv**: Lists the APIs that remain consistent across invocations.
- **undoc.json**: Contains undocumented APIs extracted from the analysis.
- **accessdenied.csv**: Logs instances where access to the API was denied.
- **other.csv**: Contains data for APIs that didn't fall into other specific categories, such as access denied or caught errors.
