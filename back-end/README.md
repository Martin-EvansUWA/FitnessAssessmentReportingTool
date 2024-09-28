# FitnessAssessmentReportingTool
BACK-END

1. Genereate a secret key with the following command

```console
foo@bar:~$ openssl rand -hex 32

```

2. To initiate user authentication, create a secret key, and set an environment variable called SECRETKEY.

Linux
```console
foo@bar:~$ export SECRETKEY="yourgeneratedsecretkey"

```

Windows powershell
```console
foo@bar:~$ idk lol i need to figure this out when we start deciding deployment

```

TODO:
1. set env variable permanently within a shell.