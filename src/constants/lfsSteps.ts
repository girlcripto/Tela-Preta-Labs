export interface LfsSubStep {
  id: string;
  title: string;
  description: string;
  command?: string;
}

export interface LfsStep {
  id: number;
  title: string;
  description: string;
  subSteps: LfsSubStep[];
  quiz: {
    question: string;
    options: string[];
    correctAnswer: number;
  }[];
}

export const LFS_STEPS: LfsStep[] = [
  {
    id: 1,
    title: "Preparing the Host System",
    description: "Ensuring the host system has all the necessary tools and libraries to build the LFS system.",
    subSteps: [
      { id: "1.1", title: "Check dependencies", description: "Run version check script to ensure all tools like GCC, Bash, Binutils are present.", command: "bash version-check.sh" },
      { id: "1.2", title: "Set bash as default shell", description: "LFS expects /bin/sh to be a symbolic link to bash.", command: "sudo ln -sf /bin/bash /bin/sh" }
    ],
    quiz: [
      {
        question: "Why is it important to check host system dependencies?",
        options: ["To ensure the UI looks good", "To prevent build failures during compilation", "To save disk space", "It's not important"],
        correctAnswer: 1
      }
    ]
  },
  {
    id: 2,
    title: "Preparing a New Partition",
    description: "Creating a dedicated partition for the LFS system to reside in.",
    subSteps: [
      { id: "2.1", title: "Create partition", description: "Use fdisk or cfdisk to create a new partition.", command: "sudo fdisk /dev/sdb" },
      { id: "2.2", title: "Create filesystem", description: "Format the new partition with ext4.", command: "sudo mkfs -v -t ext4 /dev/sdb1" },
      { id: "2.3", title: "Set LFS variable", description: "Define $LFS environment variable.", command: "export LFS=/mnt/lfs" },
      { id: "2.4", title: "Mount partition", description: "Mount the new partition to $LFS.", command: "sudo mkdir -pv $LFS && sudo mount -v -t ext4 /dev/sdb1 $LFS" }
    ],
    quiz: [
      {
        question: "What environment variable is used to reference the LFS mount point?",
        options: ["$HOME", "$LFS", "$PATH", "$ROOT"],
        correctAnswer: 1
      }
    ]
  },
  {
    id: 3,
    title: "Packages and Patches",
    description: "Downloading the source code and necessary patches for the LFS system.",
    subSteps: [
      { id: "3.1", title: "Create sources directory", description: "Create a directory for storing downloads.", command: "mkdir -v $LFS/sources && chmod -v a+wt $LFS/sources" },
      { id: "3.2", title: "Download packages", description: "Use wget to download the LFS package list.", command: "wget https://www.linuxfromscratch.org/lfs/view/stable/wget-list" }
    ],
    quiz: [
      {
        question: "Where should sources be stored in the $LFS directory?",
        options: ["/bin", "/etc", "/sources", "/usr"],
        correctAnswer: 2
      }
    ]
  },
  {
    id: 4,
    title: "Final Preparations",
    description: "Setting up the environment for building the toolchain.",
    subSteps: [
      { id: "4.1", title: "Create limited directory layout", description: "Create specific directories for tools.", command: "mkdir -pv $LFS/tools" },
      { id: "4.2", title: "Add LFS user", description: "Build the system as a non-privileged user.", command: "sudo groupadd lfs && sudo useradd -s /bin/bash -g lfs -m -k /dev/null lfs" },
      { id: "4.3", title: "Setup environment", description: "Configure .bash_profile and .bashrc for user lfs.", command: "cat > ~/.bashrc << \"EOF\"\nset +h\numask 022\nLFS=/mnt/lfs\nLC_ALL=POSIX\nLFS_TGT=$(uname -m)-lfs-linux-gnu\nPATH=/usr/bin:/bin\nexport LFS LC_ALL LFS_TGT PATH\nEOF" }
    ],
    quiz: [
      {
        question: "Why should we build LFS as a non-root user?",
        options: ["To avoid damaging the host system", "Root is too slow", "It's a requirement of GCC", "Non-root users have more permissions"],
        correctAnswer: 0
      }
    ]
  },
  {
    id: 5,
    title: "Compiling a Cross-Toolchain",
    description: "Building the initial tools that will be used to build the rest of the system.",
    subSteps: [
      { id: "5.1", title: "Compile Binutils Pass 1", description: "Build the linker and assembler.", command: "tar -xf binutils-*.tar.bz2 && cd binutils-* && ./configure ... && make && make install" },
      { id: "5.2", title: "Compile GCC Pass 1", description: "Build the cross-compiler.", command: "tar -xf gcc-*.tar.xz && cd gcc-* && ./configure ... && make && make install" }
    ],
    quiz: [
      {
        question: "Which tool is responsible for translating source code into machine code?",
        options: ["Binutils", "GCC", "Make", "Bash"],
        correctAnswer: 1
      }
    ]
  },
  {
    id: 6,
    title: "Cross Compiling Temporary Tools",
    description: "Building more tools using the cross-toolchain built in the previous step.",
    subSteps: [
      { id: "6.1", title: "Compile M4", description: "A macro processor.", command: "tar -xf m4-*.tar.xz && cd m4-* && ./configure ... && make && make install" },
      { id: "6.2", title: "Compile Ncurses", description: "Library for text-based interfaces.", command: "tar -xf ncurses-*.tar.gz && cd ncurses-* && ./configure ... && make && make install" }
    ],
    quiz: [
      {
        question: "What is the purpose of temporary tools?",
        options: ["To replace the host system", "To build the final system software in a clean environment", "To waste time", "To test the hard drive"],
        correctAnswer: 1
      }
    ]
  },
  {
    id: 7,
    title: "Entering Chroot and Building Additional Temporary Tools",
    description: "Switching to the LFS partition and finishing the temporary environment.",
    subSteps: [
      { id: "7.1", title: "Change ownership", description: "Change owner of the LFS partition to root.", command: "sudo chown -R root:root $LFS/{usr,lib,var,etc,bin,sbin,tools}" },
      { id: "7.2", title: "Prepare virtual kernel filesystems", description: "Mount dev, proc, sys, run.", command: "sudo mount -v --bind /dev $LFS/dev && sudo mount -vt proc proc $LFS/proc ..." },
      { id: "7.3", title: "Enter Chroot", description: "Start the chroot environment.", command: "sudo chroot \"$LFS\" /usr/bin/env -i ... /bin/bash --login" }
    ],
    quiz: [
      {
        question: "What does 'chroot' stand for?",
        options: ["Change Root", "Check Root", "Choose Root", "Create Root"],
        correctAnswer: 0
      }
    ]
  },
  {
    id: 8,
    title: "Installing Basic System Software",
    description: "Building the final versions of all packages that make up a basic Linux system.",
    subSteps: [
      { id: "8.1", title: "Compile Glibc", description: "The C library.", command: "patch -Np1 -i ../glibc-*.patch && ... && make && make install" },
      { id: "8.2", title: "Compile Zlib", description: "Compression library.", command: "./configure --prefix=/usr && make && make install" }
    ],
    quiz: [
      {
        question: "Which package provides the most fundamental C libraries?",
        options: ["GCC", "Glibc", "Bash", "Make"],
        correctAnswer: 1
      }
    ]
  },
  {
    id: 9,
    title: "System Configuration",
    description: "Configuring the local network, keyboard, and other settings.",
    subSteps: [
      { id: "9.1", title: "Network configuration", description: "Setup hostname and network interfaces.", command: "echo \"lfs-system\" > /etc/hostname" },
      { id: "9.2", title: "Creating /etc/inputrc", description: "Keyboard handling library configuration.", command: "cat > /etc/inputrc << \"EOF\" ... EOF" }
    ],
    quiz: [
      {
        question: "Where are system configuration files usually stored?",
        options: ["/bin", "/usr", "/etc", "/var"],
        correctAnswer: 2
      }
    ]
  },
  {
    id: 10,
    title: "Making LFS System Bootable",
    description: "Installing the kernel and the bootloader.",
    subSteps: [
      { id: "10.1", title: "Compile Linux Kernel", description: "The heart of the operating system.", command: "make menuconfig && make && make modules_install && cp -iv arch/x86/boot/bzImage /boot/vmlinuz-..." },
      { id: "10.2", title: "Install GRUB", description: "The Grand Unified Bootloader.", command: "grub-install /dev/sdb" }
    ],
    quiz: [
      {
        question: "What is the role of GRUB in a Linux system?",
        options: ["To compile code", "To edit text files", "To load the operating system during boot", "To manage network traffic"],
        correctAnswer: 2
      }
    ]
  },
  {
    id: 11,
    title: "Package Management",
    description: "Managing installed software and future updates.",
    subSteps: [
      { id: "11.1", title: "Discuss package management", description: "Deciding whether to use a package manager like pkgtool or stay manual.", command: "# manual installation is default in LFS" }
    ],
    quiz: [
      {
        question: "Does 'classic' LFS come with a built-in package manager?",
        options: ["Yes, it uses APT", "Yes, it uses RPM", "No, it's a 'build from source' system by default", "Yes, it uses Snap"],
        correctAnswer: 2
      }
    ]
  },
  {
    id: 12,
    title: "System Tuning and Optimization",
    description: "Final adjustments to improve performance and usability.",
    subSteps: [
      { id: "12.1", title: "Clean up", description: "Remove temporary files and logs.", command: "rm -rf /tmp/*" },
      { id: "12.2", title: "Strip libraries", description: "Remove debugging symbols to save space.", command: "find /usr/{lib,bin} ... -exec strip --strip-unneeded {} +" }
    ],
    quiz: [
      {
        question: "What is the purpose of stripping binaries?",
        options: ["To make them smaller by removing debugging info", "To make them run faster", "To encrypt them", "To change their icons"],
        correctAnswer: 0
      }
    ]
  }
];
