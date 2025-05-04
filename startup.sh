#!/bin/bash

encryptedPassBase64="$SECRETS_ACCESS_TOKEN"
#echo "$encryptedPassBase64"
encryptedPass=$(echo "$encryptedPassBase64" | base64 --decode)
#echo "$encryptedPass"
rotations=($(jq -r '.rotations[]' config.json))
#echo "$rotations"
decryptedPass=$(/main/rotatestring.sh "$encryptedPass" "${rotations[@]}")
#reencryptedPass=$(./rotatestring.sh "$decryptedPass" -1 -2 -3)
#echo "$decryptedPass"
#echo "$reencryptedPass"
unset SECRETS_ACCESS_TOKEN

# temporary file for passing value without living in process args
chown nodeuser:nodeuser /main
echo -n "$decryptedPass" > /main/TOKEN_FILE
chown nodeuser:nodeuser /main/TOKEN_FILE
chmod 660 /main/TOKEN_FILE

# switch to lower privileged user
exec su -c 'node /main/main.js' nodeuser
