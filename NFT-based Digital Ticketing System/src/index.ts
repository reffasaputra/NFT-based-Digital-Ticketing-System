class Ticket {
    id: string;
    eventId: string;
    ownerId: string;
    price: number;
    isTransferred: boolean;
    createdAt: Date;
    updatedAt: Date | null;
  }
  
  const ticketsStorage = StableBTreeMap<string, Ticket>(0);
  
  app.post("/tickets", (req, res) => {
    const ticket: Ticket = {
      id: uuidv4(),
      createdAt: getCurrentDate(),
      isTransferred: false,
      ...req.body,
    };
    ticketsStorage.insert(ticket.id, ticket);
    res.json(ticket);
  });
  
  app.put("/tickets/:id/transfer", (req, res) => {
    const ticketId = req.params.id;
    const ticketOpt = ticketsStorage.get(ticketId);
    if (!ticketOpt) {
      res.status(400).send(`Ticket with id=${ticketId} not found`);
    } else {
      const updatedTicket = {
        ...ticketOpt,
        ownerId: req.body.newOwnerId,
        isTransferred: true,
        updatedAt: getCurrentDate(),
      };
      ticketsStorage.insert(ticketId, updatedTicket);
      res.json(updatedTicket);
    }
  });
  