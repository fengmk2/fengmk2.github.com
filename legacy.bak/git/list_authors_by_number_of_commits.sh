# sort by number of commits
# http://www.commandlinefu.com/commands/view/4519/list-all-authors-of-a-particular-git-project
git log --format='%aN <%aE>' | awk '{arr[$0]++} END{for (i in arr){print arr[i], i;}}' | sort -rn | cut -d\  -f2-
