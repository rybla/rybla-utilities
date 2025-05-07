# E-book reader for e-ink devices

[![KOReader](https://raw.githubusercontent.com/koreader/koreader.github.io/master/koreader-logo.png)](https://koreader.rocks/)

#### KOReader is a document viewer primarily aimed at e-ink readers.

[](#koreader-is-a-document-viewer-primarily-aimed-at-e-ink-readers)

[![AGPL Licence](https://camo.githubusercontent.com/5bb38e76b63285b53eefb8b5ec6047b0ea2e12c3e4aeb04358366b5c8a22266b/68747470733a2f2f696d672e736869656c64732e696f2f6769746875622f6c6963656e73652f6b6f7265616465722f6b6f726561646572)](https://github.com/koreader/koreader/blob/master/COPYING) [![Latest release](https://camo.githubusercontent.com/f0e1aa8bfa9e1a000beef74d8a3c6c82e5730eb272790a5640b442ef481b19d2/68747470733a2f2f696d672e736869656c64732e696f2f6769746875622f72656c656173652f6b6f7265616465722f6b6f7265616465722e737667)](https://github.com/koreader/koreader/releases) [![Gitter](https://camo.githubusercontent.com/7513ddfad8bc40022e947a027b821ea79e33194c3c01f540c0d541c385cacca0/68747470733a2f2f696d672e736869656c64732e696f2f6769747465722f726f6f6d2f6b6f7265616465722f6b6f7265616465723f636f6c6f723d726564)](https://gitter.im/koreader/koreader) [![Mobileread](https://camo.githubusercontent.com/93aec7413392831b748bcae5e985b60b91edf256d39015cee75ba483038396e7/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f666f72756d2d6f6e5f6d6f62696c65726561642d6c6967687467726579)](http://www.mobileread.com/forums/forumdisplay.php?f=276) [![Build Status](https://camo.githubusercontent.com/c1ab248628b1eba39c7bd6231da7d4c4d2f09df39cce5da94e234331e1eea826/68747470733a2f2f636972636c6563692e636f6d2f67682f6b6f7265616465722f6b6f7265616465722e7376673f7374796c653d736869656c64)](https://circleci.com/gh/koreader/koreader) [![Coverage Status](https://camo.githubusercontent.com/ba8273e053b14d0b09437a11b82e8c0025ed5b42488798e7737e70e3049fa431/68747470733a2f2f636f6465636f762e696f2f67682f6b6f7265616465722f6b6f7265616465722f6272616e63682f6d61737465722f67726170682f62616467652e737667)](https://codecov.io/gh/koreader/koreader) [![Weblate Status](https://camo.githubusercontent.com/daac1cb6aa37b411df148843881e1144e1a4f7c5387114db23e928a911aed718/68747470733a2f2f686f737465642e7765626c6174652e6f72672f776964676574732f6b6f7265616465722f2d2f6b6f7265616465722f7376672d62616467652e737667)](https://hosted.weblate.org/engage/koreader/?utm_source=widget)

[Download](https://github.com/koreader/koreader/releases) • [User guide](http://koreader.rocks/user_guide/) • [Wiki](https://github.com/koreader/koreader/wiki) • [Developer docs](http://koreader.rocks/doc/)

## Main features

[](#main-features)

*   **portable**: runs on embedded devices (Cervantes, Kindle, Kobo, PocketBook, reMarkable), Android and Linux computers. Developers can run a KOReader emulator in Linux and MacOS.
    
*   **multi-format documents**: supports fixed page formats (PDF, DjVu, CBT, CBZ) and reflowable e-book formats (EPUB, FB2, Mobi, DOC, RTF, HTML, CHM, TXT). Scanned PDF/DjVu documents can also be reflowed with the built-in K2pdfopt library. [ZIP files](https://github.com/koreader/koreader/wiki/ZIP) are also supported for some formats.
    
*   **full-featured reading**: multi-lingual user interface with a highly customizable reader view and many typesetting options. You can set arbitrary page margins, override line spacing and choose external fonts and styles. It has multi-lingual hyphenation dictionaries bundled into the application.
    
*   **integrated** with _calibre_ (search metadata, receive ebooks wirelessly, browse library via OPDS), _Wallabag_, _Wikipedia_, _Google Translate_ and other content providers.
    
*   **optimized for e-ink devices**: custom UI without animation, with paginated menus, adjustable text contrast, and easy zoom to fit content or page in paged media.
    
*   **extensible**: via plugins
    
*   **fast**: on some older devices, it has been measured to have less than half the page-turn delay as the built in reading software.
    
*   **and much more**: look up words with StarDict dictionaries / Wikipedia, add your own online OPDS catalogs and RSS feeds, over-the-air software updates, an FTP client, an SSH server, …
    

Please check the [user guide](http://koreader.rocks/user_guide/) and the [wiki](https://github.com/koreader/koreader/wiki) to discover more features and to help us document them.

## Screenshots

[](#screenshots)

[![](https://github.com/koreader/koreader-artwork/raw/master/koreader-menu-thumbnail.png)](https://github.com/koreader/koreader-artwork/raw/master/koreader-menu.png) [![](https://github.com/koreader/koreader-artwork/raw/master/koreader-footnotes-thumbnail.png)](https://github.com/koreader/koreader-artwork/raw/master/koreader-footnotes.png) [![](https://github.com/koreader/koreader-artwork/raw/master/koreader-dictionary-thumbnail.png)](https://github.com/koreader/koreader-artwork/raw/master/koreader-dictionary.png)

## Installation

[](#installation)

Please follow the model specific steps for your device:

[Android](https://github.com/koreader/koreader/wiki/Installation-on-Android-devices) • [Cervantes](https://github.com/koreader/koreader/wiki/Installation-on-BQ-devices) • [Kindle](https://github.com/koreader/koreader/wiki/Installation-on-Kindle-devices) • [Kobo](https://github.com/koreader/koreader/wiki/Installation-on-Kobo-devices) • [Linux](https://github.com/koreader/koreader/wiki/Installation-on-desktop-linux) • [Pocketbook](https://github.com/koreader/koreader/wiki/Installation-on-PocketBook-devices) • [reMarkable](https://github.com/koreader/koreader/wiki/Installation-on-Remarkable)

## Development

[](#development)

[Setting up a build environment](https://github.com/koreader/koreader/blob/master/doc/Building.md) • [Collaborating with Git](https://github.com/koreader/koreader/blob/master/doc/Collaborating_with_Git.md) • [Building targets](https://github.com/koreader/koreader/blob/master/doc/Building_targets.md) • [Porting](https://github.com/koreader/koreader/blob/master/doc/Porting.md) • [Developer docs](http://koreader.rocks/doc/)

## Support

[](#support)

KOReader is developed and supported by volunteers all around the world. There are many ways you can help:

*   [fix bugs](https://github.com/koreader/koreader/issues?q=is%3Aopen+is%3Aissue+label%3Abug) and [implement new features](https://github.com/koreader/koreader/issues?q=is%3Aopen+is%3Aissue+label%3Aenhancement)
*   [translate the program into your language](https://hosted.weblate.org/engage/koreader/?utm_source=widget) or improve an existing translation
*   document lesser-known features on the [wiki](https://github.com/koreader/koreader/wiki)
*   help others with your knowledge on the [forum](http://www.mobileread.com/forums/forumdisplay.php?f=276)

Right now we only support [liberapay](https://liberapay.com/KOReader) donations.

## Contributors

[](#contributors)

[![Last commit](https://camo.githubusercontent.com/67345c78507e396cc6c9462876617c5de9d889023620822527a68bea7eca06dd/68747470733a2f2f696d672e736869656c64732e696f2f6769746875622f6c6173742d636f6d6d69742f6b6f7265616465722f6b6f7265616465723f636f6c6f723d6f72616e6765)](https://github.com/koreader/koreader/commits/master) [![Commit activity](https://camo.githubusercontent.com/1f46f03040612f161709c63f954f32574d180ae5c7c499457ebe654374d91977/68747470733a2f2f696d672e736869656c64732e696f2f6769746875622f636f6d6d69742d61637469766974792f6d2f6b6f7265616465722f6b6f726561646572)](https://github.com/koreader/koreader/pulse)