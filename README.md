# Zor-Tex
A native Powerline-esqe Bash Prompt

This bash prompt doesn't require any patching of fonts; just have a fully
unicode-supported font and you're golden.

Implemented in Node.JS.

## Example *.bash_prompt*

~~~bash
#!/bin/bash

function git_prompt() {
  if command -v git &>/dev/null; then
    status=$(git status 2> /dev/null)
    [ $? -eq 0 ] || return 0

    tags=
    test "$(echo "$status" | grep "Untracked files:")" && tags="$tags?"
    test "$(echo "$status" | grep "Changes not staged")" && tags="$tags!"
    test "$(echo "$status" | grep "Changes to be committed:")" && tags="$tags+"
    [ $(echo "$tags" | tr -d "\\r\\n" | wc -c) -eq 0 ] || tags=" [$tags]";

    branch="$(echo $status | grep "On branch" | awk '{print $3}')"
    [ $(echo "$branch" | wc -c) -eq 0 ] || branch="$branch - ";

    commit="$(git show-ref)"
    commit="${commit:0:7}"

    echo -e "$branch$commit$tags"
  fi
}

# Make sure to change the path below
export PS1='$(node /path/to/zor-tex/zor-tex.js "$(echo $USER | tr '[:lower:]' '[:upper:]')" "\w" "$(git_prompt)" "$(date +"%a %b %d, %R")")\n$ '
~~~

## Screenshot
![zor-tex screenshot](http://i.imgur.com/D31yvJy.png?1)
