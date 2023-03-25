# Flags

As development cycles become more rapid, it's important to have a way to quickly
and easily modify the behavior of your application while it's live. It's not
time efficient to have to rebuild and redeploy your application every time you
want to change a flag especially when its modification is time sensitive. That's
where Flags comes in. Flags is a simple service that allows you to create
criteria based flags that can be enabled or disabled on the fly.

## Getting Started

Flags operates on a simple RESTful API that can be accessed by your application
or server to determine if a flag is enabled or disabled. Flags also provides a
simple web interface for managing your flags. Using a simple web interface, you
can create, modify, and delete flags as well as enable or disable them in
various ways. These can include rolling updates, percentage based updates, and
more.
