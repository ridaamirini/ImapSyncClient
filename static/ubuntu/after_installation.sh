#!/bin/sh

# =================================================
# = Installing imapsync on Ubuntu 16.04 or higher =
# =================================================

# Here is  the command to install imapsync dependencies,
# you need root privilege to run them.
# This command installs standard Ubuntu packages:

sudo apt-get install \
libauthen-ntlm-perl    \
libclass-load-perl     \
libcrypt-ssleay-perl   \
libdata-uniqid-perl    \
libdigest-hmac-perl    \
libdist-checkconflicts-perl \
libfile-copy-recursive-perl \
libio-compress-perl     \
libio-socket-inet6-perl \
libio-socket-ssl-perl   \
libio-tee-perl          \
libmail-imapclient-perl \
libmodule-scandeps-perl \
libnet-ssleay-perl      \
libpar-packer-perl      \
libreadonly-perl        \
libregexp-common-perl   \
libssl-dev              \
libsys-meminfo-perl     \
libterm-readkey-perl    \
libtest-fatal-perl      \
libtest-mock-guard-perl \
libtest-pod-perl        \
libtest-requires-perl   \
libtest-simple-perl     \
libunicode-string-perl  \
liburi-perl             \
libtest-nowarnings-perl \
libtest-deep-perl       \
libtest-warn-perl       \
make                    \
cpanminus

# You can easily detect any missing Perl modules via the prerequisites_imapsync script
# wget -N https://imapsync.lamiral.info/prerequisites_imapsync
# sh prerequisites_imapsync