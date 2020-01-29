# NSA Codebreaker Challenge - 2016
This semester I’m taking a Computer Security course. So far we’ve discussed OS security features, storage features, and buffer overflow attacks.  While listening to a lecture on return oriented programming I was reminded of this challenge. Though I was too busy to partake while it was happening, I was glad to see it is still available to complete. Below I catalog the challenges and how I approached them. Feel free to comment with any questions and I can try to clarify!

## Task 1.1 - Information Gathering and Triage
::: tip
“A military organization captured a laptop of a known explosives expert within a terrorist organization.  Further analysis revealed that the laptop contained a debug version of the remote client interface that the individual used to communicate with the IEDs. To help detect other client programs in use, we are cataloging binary signatures and basic network signatures for every version of the IED software we find. To support these efforts, your task is to compute the SHA256 hash of the client binary and identify the source and destination TCP ports that it uses when connecting to an IED.”
:::


For this challenge we are given a binary called “client”.  The first request is rather simple - generate a SHA256 hash of the file. This simply required me to run the sha256sum program that comes by default on most linux distros.  After completing this, my next thought was to simply run it in my Kali Linux vm to see what happens.   
Hmm, that was interesting. Obviously the file exists because we can see its a 32-bit executable.  It must just have been written to mess with the user and main returns 127.  Next, I threw it into Hopper on my mac to disassemble the file.  Taking a look at the call tree I can see that it branches out the most on the right, so that must be where the real execution takes place.  



I followed the tree down to the right and was able to find the place where the program communicates via stdout that it will be attempting a connection and specifies the ports.  From there I simply needed to convert the two hex values pushed onto the stack before the format string.  




Final answers for this stage: 

    SHA256: ec4c4d4e60fdae486865171fd44a4142792d18dab6221ed9ce041811ef49e4
    Source Port: 12666
    Destination Port: 8080

## Task 1.2 - Information Gathering and Triage
::: tip
“Great work! Based on the signatures you provided, we were able to collect network communications that we believe contains traffic to an IED that is about to be detonated. Unfortunately, there appears to be a lot of unrelated network traffic in the collected data since other programs use the same port. Using the provided packet capture file (PCAP), we need your help to create more specific signatures for identifying network communications with the IED. This would be a huge first step in detecting when an IED has been armed, for example, which would allow us to alert troops in the region around where the signal was collected. For this task, your goals are to identify the version string sent by the client software when initiating a connection to the IED and to determine the IP address of the undetonated IED from the packet capture.
:::

UPDATE: Intelligence suggests that the version strings are 11 characters long and look something like x.x-xxxxxxx”

Ahh, the next step requires some network traffic analysis. Thankfully I already had wireshark installed on my mac (and they finally updated it this summer to stop using X11 windowing) so I was able to open the pcap right away.  My time this past summer as a security engineer intern prepared me well. I was trained in wireshark and spent a great deal of time analyzing customer traffic to determine if there were any suspicious anomalies.  The challenge here can really be summed up by the question: Do you know how to use wireshark (and regex)?  If you don’t already know how to use it, prepare yourself.  Its a wonderfully powerful tool which is great. But its also a powerful tool with TONS of options and can have a steep learning curve at first.  If you’d like to learn more, howtogeek has a solid tutorial (http://www.howtogeek.com/104278/how-to-use-wireshark-to-capture-filter-and-inspect-packets/) to get you up to speed.

So, how did I solve this one?  Given that the pcap has 138 different endpoints and is 3.8 MB total it was unreasonable to sift through by hand.  Thankfully, the update provides all of the direction we need. I spent a bit dusting off the regex cobwebs in my brain and built a functioning expression that matched! 

Now that I had the expression, I tried filtering off of it. This filter still left me with 279 packets to sift through - not bad, but still quite time consuming.  I took another look at the pseudo code provided by hopper and noticed that it didn’t seem to be calling any libraries for HTTP or implementing any HTTP protocols so I appended a “not http” filter and voila! I was left with a ton of reassembled PDU’s and a single tcp session.  Upon inspection of the tcp session stream (it was stream 52) I was able to grab the version number and the destination IP and submit them. 

    Final Wireshark Filter: frame matches "[a-zA-Z0-9]\.[a-zA-Z0-9][-][a-zA-Z0-9]{7}" && not http
    Destination IP: 10.27.191.81
    Version Number: 3.6-dev8925


## Task 2.1 - Disarm Capability

::: tip
“Thanks to your hard work we were able to eventually geolocate the device and work with military partners to retrieve the system for further analysis. It turned out to be a test system that one of the IED developers had been using in lieu of a live device. We provided the system to a team of software reverse engineers and their preliminary assessment is that we have a fully functional copy of the IED software, a key file, and a dummy driver that emulates the various IED states. Analysts believe that this key file contains the information needed to authenticate to a real IED (somewhere in the field) and send commands to it. Presumably this test system was used to validate the software and key file before it was deployed to an actual IED. Since the key file appears to be encrypted, we are going to need your help to figure out a way to decrypt it. This should enable us to disarm the fielded IED that uses this key, though we will still need to figure out exactly how it is being used for authentication (next task). The goal of this task is for you to obtain the decrypted contents of the key file.”
:::

After the recon stages, I was asked to begin working on the capability to disarm one of the IED’s. The first step in this task provided me with three files. A server binary, a test driver and an encrypted key file. The first step I took was to run strings on the server binary.  This output a TON of lines.  14,847 to be exact (s/o to wc for not making me do that manually). I took a quick scroll through the lines lines looking for anomalies. In the middle of the output I noticed a big block of text that, upon closer investigation, was an RSA private key block. 

I figured that this might be useful so I copied it into a text file and tried a simple OpenSSL decryption on the key file we were provided using it. Lo, and behold it actually decrypted the file! What I found was what looked like a protocol designation ```otpauth://``` along with a path to ```/totp/791507179``` along with the url parameter ```secret=6Z2F47DXRF5WMHXCPZ4ATZBJ4VNVBLU4XGYK2DP5WM75HSVJHR6Q```  This should all come in handy for the next stage!  

    Full File Contents: otpauth://totp/791507179?secret=6Z2F47DXRF5WMHXCPZ4ATZBJ4VNVBLU4XGYK2DP5WM75HSVJHR6Q
 

## Task 2.2 - Disarm Capability

::: tip
“Perfect! Now that we have the key file we can work on a disarm capability. Several intelligence reports suggest that terrorists use a secure token (i.e., small hardware device) for generating unique one-time codes for authenticating to the IED when sending commands. We believe these codes change over time and are only valid for a certain time window and for specific device serial numbers. Based on previous signatures you provided, we have located the armed IED that is using the same version of software and key serial number from Task 3 and we need to disarm it ASAP. We do not have the secure token that corresponds to the device, but we still need to be able to authenticate to it with the correct code in order to disarm it. Your objective for this task is to figure out how to generate valid one-time codes and provide one that we can use to disarm the IED. The decrypted key file you provided earlier should help with this part.”
:::

I found this task to be interesting and challenging.  I actually spent a lot of time on what turned out to be dead ends in an attempt to figure out the OTP. The challenge for me was recognizing what the secret key was and how it was being used for a OTP.  I, unfortunately, spent a great deal of time thinking the challenge was to reverse engineer the driver and thought that the OTP would be coming from that (like a yubikey or something).  This was just an effect of my lack of experience with oauth and OTP’s.  I’m glad I did spend the time doing this, even if it was ultimately the wrong path, because I got the chance to learn about linux driver ioctl function calls!  

After spending a few hours in a day trying to reverse engineer the driver, I decided it was best to take a break.  The next day, I decided to approach the problem as an investigation into how the key was being used and what actually TOTP is. I had originally believed it to be something that was special to the challenge application, however upon further research I learned that it is a time based OTP. After realizing this, I found a utility called oathtool which was able to generate TOTP authenticators for me to use in the client!  The final command only required me to tell the tool that the string was encoded in base32 and to use the —totp flag.  I was then able to use the disarm command!

Final Token (or how to generate it): ```oathtool --totp -b <token> ```
