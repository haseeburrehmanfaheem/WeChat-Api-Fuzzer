# WeChat API Fuzzer

This repository contains tools for analyzing and dynamically invoking WeChat Miniapp APIs. The goal is to evaluate which Android Framework APIs do miniapp APIs invoke to create a mapping between miniapp-framework APIs.

## Overview

The main code is located in the `Evalulate-WeChat` folder. It leverages WeChat's devtools to execute miniapp APIs dynamically using the Chrome debugger protocol. Specifically, the code reverse engineers and customizes the WeChat debugging protocol to invoke APIs on targeted platforms.



#### Evalulate-WeChat

- **Purpose**: This is the core folder where the reverse-engineered WeChat debug protocol is implemented. It allows the evaluation of JavaScript miniapp APIs directly through the `evaluate` function in the debug protocol.
- **Key Files**:
  - `evaluateParameters.js`: Implements the functionality for dynamically invoking miniapp APIs using WeChat's debug protocol.
  - `evaluateImproved.js`, `evaluateNew.js`: Variations of the evaluation script for experimentation.
  - `invariantApis.csv`: List of APIs extracted using static analysis of WeChat apk.
  - `undoc.json`: JSON containing undocumented APIs (APIs extracted using static analysis but not mentioned in the documentation).

#### Eval-Output

- **Purpose**: This folder stores the evaluation results, showing which APIs successfully ran and which ones generated errors.
- **Key Files**:
  - `accessdenied.csv`, `catch.csv`, `df_other.csv`, `other.csv`: CSV files recording the API responses, such as denied access or errors caught during execution.

#### Fill-Parameters

- **Purpose**: This folder contains scripts to fill in the required parameters for miniapp APIs based on static analysis of the APIs. A template-based approach is used.
 
## Usage
### Evaluate Parameters:

The `evaluateParameters.js` file in the `Evalulate-WeChat` folder is the primary entry point. It feeds JavaScript code into the WeChat debug protocol and logs the output.

### Filling Parameters:

The scripts in the `Fill-Parameters` folder take the WeChat APIs and their required parameters (from CSV files) and fill them using default parameters, following a templated approach.

### API Evaluation:

After dynamically invoking the APIs, the results are stored in the `Eval-Output` folder. The CSV files record successful invocations and errors encountered during execution.

contributions welcome ! :)
