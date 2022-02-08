import * as cdk from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';
import * as kinesis from '@aws-cdk/aws-kinesis';
import * as firehose from '@aws-cdk/aws-kinesisfirehose';
import * as destinations from '@aws-cdk/aws-kinesisfirehose-destinations';

export class AwsDatalakePlatformStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const bucket = new s3.Bucket(this, 'Destination', {
      bucketName: `streaming-destination-${this.account}`
    });

    const inputStream = new kinesis.Stream(this, 'Input Stream', {
      shardCount: 1,
      streamName: 'input-stream',
    });

    new firehose.DeliveryStream(this, 'Delivery Stream', {
      sourceStream: inputStream,
      deliveryStreamName: 'delivery-stream',
      destinations: [new destinations.S3Bucket(bucket)],
    });
  }
}
