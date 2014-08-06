# mk2 git flow

## 必须先设置你在当前项目的用户名和邮箱

```bash
cd yourprojectdir/
git config user.name "苏千"
git config user.email "suqian.yf@taobao.com"
```

## (衍合)rebase before branch merge to master

![http://git-scm.com/figures/18333fig0328-tn.png](http://git-scm.com/figures/18333fig0328-tn.png)

当发现branch无法让master 快进合并的时候，需要在分支上进行一次对master的rebase

```bash
$ git checkout mybranch
$ git rebase origin/master
```

这样，解决分支与主干代码冲突的责任，将由分支提交人来解决。

复杂的rebase

![http://git-scm.com/figures/18333fig0331-tn.png](http://git-scm.com/figures/18333fig0331-tn.png)

需要将 client 分支合并到 master

“取出 client 分支，找出 client 分支和 server 分支的共同祖先之后的变化，然后把它们在 master 上重演一遍”

```bash
$ git checkout client
$ git rebase --onto master server client
```

![http://git-scm.com/figures/18333fig0332-tn.png](http://git-scm.com/figures/18333fig0332-tn.png)

### 衍合的风险

奇妙的衍合也并非完美无缺，要用它得遵守一条准则：

`"一旦分支中的提交对象发布到公共仓库，就千万不要对该分支进行衍合操作。"`

如果把衍合当成一种在推送之前清理提交历史的手段，而且仅仅衍合那些尚未公开的提交对象，就没问题。如果衍合那些已经公开的提交对象，并且已经有人基于这些提交对象开展了后续开发工作的话，就会出现叫人沮丧的麻烦。

如果已经提交分支到远端，那么需要rebase的话，必须在rebase后，重新提交到新的分支，避免影响原有分支。
