# copy-cookie

A chrome extension to copy cookies across the domains.

Link: [Webstore Url](https://chrome.google.com/webstore/detail/efgblkeenphclkonjikaanjnlconlkfp).

To load the dev version:

1. Go to extension in Chrome
2. Turn on `Developer mode`
3. Click `Load Unpacked`
4. Select the folder

| Copy                                                                                     | Paste                                                                                    | Done                                                                                     |
| ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| ![Screenshot from 2020-06-27 23-09-34](https://user-images.githubusercontent.com/20407975/85928905-52ca8800-b8ce-11ea-9499-51b83429fb36.png) | ![Screenshot from 2020-06-27 23-09-56](https://user-images.githubusercontent.com/20407975/85928906-53fbb500-b8ce-11ea-84c3-37f5e5d5f79a.png) | ![Screenshot from 2020-06-27 23-10-53](https://user-images.githubusercontent.com/20407975/85928907-55c57880-b8ce-11ea-9026-7dfd318da39c.png) |

## update
1. 修复了Set Cookie时由于domain不正确导致的错误
2. 为了方便, 使用非active和title来作为target tab的查询条件, 并且记住title, 这样操作时, 只要在被复制的tab里点copy,在输入target title即可.
3. 增加background.js 是为了可以使用inspect panel来调试插件.