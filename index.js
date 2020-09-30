const fs = require('fs')
const git = require('isomorphic-git');

const dir = 'temp'

;(async () => {
  try {
    await fs.promises.rmdir(dir, { recursive: true })
  } finally {
    await fs.promises.mkdir(dir)
  }

  await git.init({ fs, dir })

  const parent = await git.commit({ fs, dir, message: 'Initial commit', author: { name: 'Will', email: '' }})

  const emptyDir = '4b825dc642cb6eb9a060e54bf8d69288fbee4904';
  
  const tree = [
    {
      "mode": "040000",
      "path": "src",
      "oid": emptyDir,
      "type": "tree"
    }
  ]

  const parentTree = await git.writeTree({ fs, dir, tree })

  console.log(parent, parentTree)

  const final = await git.writeCommit({ fs, dir, commit: {
    message: 'Add empty directory',
    tree: parentTree,
    parent: [parent],
    author: {
      name: 'Will',
      email: '',
      timestamp: Math.floor(Date.now() / 1000),
      timezoneOffset: -300
    }
  }})

  await git.writeRef({
    fs,
    dir,
    ref: 'refs/heads/master',
    value: final,
    force: true,
  })
  console.log(final)
})()
