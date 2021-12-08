import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";
import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity";

//const { LambdaClient, AddLayerVersionPermissionCommand } = require("@aws-sdk/client-lambda");

const lambdaClient = new LambdaClient({
  region: "us-east-2",
  credentials: fromCognitoIdentityPool({
    client: new CognitoIdentityClient({ region: "us-east-2" }),
    identityPoolId: "us-east-2:972bc7a9-0526-43b4-8f54-145d684d2e5e", // IDENTITY_POOL_ID e.g., eu-west-1:xxxxxx-xxxx-xxxx-xxxx-xxxxxxxxx
  })
});

async function getData(payload) {
  console.log(payload);
  const result = await lambdaClient.send(new InvokeCommand({
    FunctionName: "flights-service",
    InvocationType: 'RequestResponse',
    LogType: "Tail ",
    Payload: new TextEncoder("utf-8").encode(JSON.stringify(payload)),
  }));
  const flightData = JSON.parse(
    //parse Uint8Array payload to string
    new TextDecoder("utf-8").decode(result.Payload)
  );
  console.log(flightData);
  return flightData.Items;
}

export { getData };
