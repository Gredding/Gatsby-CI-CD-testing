import { BlockPublicAccess, Bucket, BucketEncryption } from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import { CloudFrontWebDistribution, OriginAccessIdentity } from '@aws-cdk/aws-cloudfront';


export class CdkGatsbyAppStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const s3Bucket = new Bucket(this, 's3bucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      versioned: false,
      publicReadAccess: false,
      encryption: BucketEncryption.S3_MANAGED,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL
    });
      const oia = new OriginAccessIdentity(this, 'OIA', {
      comment: "Created by CDK"
    });

      s3Bucket.grantRead(oia);
      new CloudFrontWebDistribution(this, 'WebCloudFront', {
          originConfigs: [
              {
                  s3OriginSource: {
                      s3BucketSource: s3Bucket,
                      originAccessIdentity: oia
                  },
                  behaviors: [
                      { isDefaultBehavior: true }
                  ]
              }
          ]
      });
  }
}

