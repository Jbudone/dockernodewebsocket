#!/bin/bash

if [ "$#" -lt 2 ]; then
    echo "Usage: $0 encryptedKey num1 num2 ..."
    exit 1
fi

input="$1"
shift

# The array of numbers for rotation
rotations=("$@")

# Function to rotate a character by a given number
rotate_char() {
    local char=$1
    local num=$2
    # Get ASCII value of character
    ascii=$(printf "%d" "'$char")
    # Rotate character
    new_ascii=$((ascii + num))
    # Wrap around if it goes past 'z' or before ' '
    if [ $new_ascii -gt 122 ]; then
        new_ascii=$((new_ascii - 91))
    elif [ $new_ascii -lt 32 ]; then
        new_ascii=$((new_ascii + 91))
    fi
    # Convert back to character
    printf "\\$(printf '%03o' "$new_ascii")"
}

# Rotate the string
output=""
for ((i=0; i<${#input}; i++)); do
    char="${input:$i:1}"
    num="${rotations[$i % ${#rotations[@]}]}"
    output+=$(rotate_char "$char" "$num")
done

echo "$output"
