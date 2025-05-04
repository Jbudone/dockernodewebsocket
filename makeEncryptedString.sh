#!/bin/bash

# PUT PASSWORD IN THIS TO RUN
decryptedPass=""

key=()
decKey=()
for ((i=0; i<${#decryptedPass}; i++)); do

    # only key ascii characters
    #char="${decryptedPass:$i:1}"
    #ascii=$(printf "%d" "'$char")
    #randNum=0
    #if [ $ascii -lt 123 ] && [ $ascii -gt 96 ]; then
    randNum=$((RANDOM % 27))
    #fi
    key+=("$randNum")
    decKey+=("$(($randNum * -1))")
done


encryptedPass=$(./rotatestring.sh "$decryptedPass" "${decKey[@]}")
encryptedPassBase64=$(echo $encryptedPass | base64 -w 0)
echo "Encrypted Pass: $encryptedPassBase64"
IFS=", "
echo "Encryption Key: ${key[*]}"
unset IFS

echo "${decKey[@]}"
redecryptedPass=$(./rotatestring.sh "$encryptedPass" "${key[@]}")
echo "$redecryptedPass"
