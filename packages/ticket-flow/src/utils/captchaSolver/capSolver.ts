import got from 'got';

import {capSolverResponse} from './schema';

// https://docs.capsolver.com/guide/recognition/ImageToTextTask.html#example-request

interface Request {
  base64Buffer: string;
  apiKey: string;
}

export async function capSolver(request: Request) {
  const requestBody = getCapSolverRequest(request);
  const response = await got
    .post('https://api.capsolver.com/createTask', {
      json: requestBody,
    })
    .json();
  const result = capSolverResponse.safeParse(response);
  if (!result.success) {
    throw new Error('Solve captcha failed');
  }
  return result.data.solution.text;
}

interface CapSolverRequest {
  clientKey: string;
  task: {
    type: 'ImageToTextTask';
    module: 'common';
    body: string;
    score: 1;
    case: false;
  };
}

function getCapSolverRequest(request: Request): CapSolverRequest {
  return {
    clientKey: request.apiKey,
    task: {
      type: 'ImageToTextTask',
      module: 'common',
      body: request.base64Buffer,
      score: 1,
      case: false,
    },
  };
}
