# fullstack-app
fullstack-app


Post exam tasks:

Make sure to have good tests. and a good code base.

Unit tests should be unit tests, to test the back, we should mock the db, not use it.

The same thing to test the front

The integration test should be end to end. Think of a test case and apply it.

Unit tests should be functional, Test a functionality, not a change of headline for example.

Unit and integration tests should run within the build Job
unit and Integration tests should run within the deploy to ec2 job

They should not run in parallell but within the build and deploy (i think unit in build and integration in deploy, validate that)

deploy to ec2 job is currently cloning the image from git. It should not do that. It should build from docker.

