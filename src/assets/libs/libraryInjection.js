
const hooks = new Hooks();

woServices.Add("Hooks", hooks);
woServices.Add("Socket", new EventDrivenSocket(hooks));
woServices.Add("WhosOnConn", new WhosOnSocket("localhost", hooks));