# Reading Your Car's OBD II Output

I’ve always been fascinated by cars. Well, really vehicles in general.  The fact that people have figured out how to get thousands of distinct pieces to function together well enough to trust it with our safety astounds me. In this fascination, I decided I wanted to a dig a bit deeper into how a car actually functions.  Of course, there’s the engine, the drivetrain, the brakes, etc but the question I asked, being a Computer Science student, is how it all fits together. So the real question is, “How do the brakes, engine, air-conditioning, engine, exhaust, air-intake, locks, dashboard, and 50 other things all talk to each other?

The answer is rather simple. Most of the time these are all connected to what’s called a Controller Area Network (CAN) bus.  If you think back to the beginning of your networks class or are old enough to remember it being a common occurrence you might recall a bus network. For those whose memory has perhaps lapsed, a bus network is a network where all devices are connected to the same data stream. That means that if one device sends out a packet of data, every other device on the network receives that packet.  As you can imagine, this creates a TON of traffic but is also awesome if you’re wanting to see how your car works.  This bus can be interfaced using the standard OBD-II port found on almost all modern cars.  After discovering how these work I ordered an OBD-II adapter from Amazon to get tinkering with my car.

::: danger
Disclaimer: I’ve never really worked with serial connections professionally before. This stuff below, if attempted, is at your own risk. Sure, it worked for me but if you don’t feel confident (or stupid) enough to mess around with your car, don’t. Seriously, this could possibly jack your car up.
:::

## Finding the port on your car
This step is usually pretty straightforward.  The law (in the United States) mandates that the OBD-II port be within a couple of feet of the steering wheel.  Usually, its under the steering wheel on either the right or left side.  Look past the plastic and up inside the footwell – it should be there. If you still can’t find it, a quick search for your make and model of the car should help you find it.

 
## Using your computer to connect to a serial connection
There are a number of ways to connect to your ELM327 from your computer.  You could download a serial console emulator and connect your device to it, or if you run OSX or Linux you can use the handy utility screen which acts as a screen manager using VT100/ANSI terminal emulation.  Its really quite useful. Here’s how I connected to my adapter:

    screen -L /dev/tty.SLAB_USBtoUART 38400

What’s this command doing?  We’re telling screen to turn on output logging with the -L command then we’re specifying the device we want to connect to.  Most ELM327 drivers will mount using the name you see here, SLAB_USBtoUART. Lastly, that large number at the end is the baud rate which hopefully you remember specifies the speed at which the devices communicate with each other.  Once you run this command, you should see a blank screen with a prompt. At this point you’re ready to start interacting with the device!  Just be warned there are a few steps I recommend to configure your ELM and make it easier to use.

## Understanding ELM327 Commands
This device has a ton of options, the full list can be found from elm electrionic’s website, here. (Note: all the commands seen in that PDF assume you’ve entered I’m just going to gloss over a few here but first I’ll go through the few I recommend you run every time you connect.  First, you’ll want to type ```ATL1``` then press enter. This will turn on linefeeds so that all the output doesn’t keep overwriting itself. Next you’ll want to turn on ATH1 to turn on the CAN headers, especially if you’re wanting to do any kind of analysis.  Next you’ll want to run “ATS1” to turn on the printing of spaces.  Lastly, running “ATAL” you can turn on allowing long packets which is useful to view more than the standard length packet. From here you should be able to run what you’d like and start collecting data.  The command to start collecting data is “ATMA” however you may find that the buffer on your ELM327 fills up too quickly.  If that seems to be the case you’ll need to filter your packets based on specifically what you want using the command ```ATCM <hex mask>```  This should help to alleviate the ```buffer filled``` error you may find.  Below is a table that outlines the commands I’ve shared here but in a more concise format.

    ATL1 - Turn on LineFeed
    ATH1 - Turn on headers
    ATS1 - Turn on spaces
    ATAL - Allow long packets
    ATCM - Use a hex mask to filter packets
    ATMA - Turn on collect all packets


## Final Thoughts

This is a really cool little board that can be purchased for a relatively inexpensive price.  I always find it cool being able to tinker around with the things I use every day, especially something as complicated as a car.  I’ve also written an application in Go that can help do the interfacing with and data dumping from the module. It should be pretty quick as I attempt to pull data from the buffer ASAP in hopes that it doesn’t fill up, but inevitably we can only move as fast as the ELM327 chip :(.  That code can be found [here](https://github.com/rreichel3/gobd).
