# @0x12b/dotty-cli

Dotty is a tool for managing dotfiles and client rigging on macOS using a simple json config file and homebrew.

## Config
Put your config in a file named `dotty.config.json`, for example in your dotfiles repo.

#### dotfiles
| Parameter           | Usage                                              |
| ------------------- | -------------------------------------------------- |
| label               | displayed during installation                      |
| source              | the destination of the symlink                     |
| target              | the full path of the symlink                       |

#### brews / casks
| Parameter           | Usage                                              |
| ------------------- | -------------------------------------------------- |
| name                | cask or formula to install                         |
| customCheck         | command to run to check if its already installed   |
| prepare             | command to run before attempting to install        |
| extensionInstallCmd | command to exec to perform extension installations |
| extensions          | string array of extensions for the install cmd     |

### Example
```
{
  "dotfiles": [{
      "label": "example file",
      "source": "example.json",
      "target": "~/example.json"
    }
  ],
  "brews": [
    { "name": "wget"  },
    { "name": "sshfs" }
  ],
  "casks": [
    {
      "name": "spotify",
      "customCheck": "find /Applications/Spotify.app"
    },
    {
      "name": "dropbox",
      "customCheck": "find /Applications/Dropbox.app"
    },
    {
      "name": "slack",
      "customCheck": "find /Applications/Slack.app"
    },
    {
      "name": "osxfuse",
      "prepare": "brew tap homebrew/cask",
      "customCheck": "find /Library/PreferencePanes/OSXFUSE.prefPane"
    }
  ]
}
```