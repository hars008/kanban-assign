import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

import "./App.css";

import ColumnList from "./Components/ColumnList/ColumnList";
import Navbar from "./Components/Header/Header";

function App() {
  const statuses = ["In progress", "Backlog", "Todo", "Done", "Cancelled"];
  const [users, setusers] = useState([]);

  const priorities = [
    { name: "Urgent", priority: 4 },
    { name: "High", priority: 3 },
    { name: "Medium", priority: 2 },
    { name: "Low", priority: 1 },
    { name: "No priority", priority: 0 },
  ];

  const [groups, setGroups] = useState("status");
  const [ordering, setOrdering] = useState("title");
  const [ticketings, setTicketings] = useState([]);

  const orderDataByValue = useCallback(
    (cardsArry) => {
      if (ordering === "title") {
        cardsArry.sort((a, b) => {
          const titleA = a.title.toLowerCase();
          const titleB = b.title.toLowerCase();
          return titleA.localeCompare(titleB);
        });
      } else if (ordering === "priority") {
        cardsArry.sort((a, b) => b.priority - a.priority);
      }
      setTicketings([...cardsArry]);
    },
    [ordering]
  );

  useEffect(() => {
    async function fetchData() {
      const response = await axios.get(
        "https://api.quicksell.co/v1/internal/frontend-assignment"
      );
      if (response.status === 200) {
        const ticketArr = response.data.tickets.map((ticket) => {
          const user = response.data.users.find(
            (user) => user.id === ticket.userId
          );
          return { ...ticket, userObj: user };
        });
        setTicketings(ticketArr);
        orderDataByValue(ticketArr);
        const userArr = response.data.users;
        setusers(userArr);
        // console.log(users);
      }
    }
    fetchData();
  }, [orderDataByValue]);

  const changeGroups = (value) => {
    setGroups(value);
  };

  const changeOrdering = (value) => {
    setOrdering(value);
  };

  return (
    <>
      <Navbar
        groupValue={groups}
        orderValue={ordering}
        handleGroupValue={changeGroups}
        handleOrderValue={changeOrdering}
      />
      <section className="board-details">
        <div className="board-details-list">
          {
            {
              status: statuses.map((listItem) => (
                <ColumnList
                  key={listItem}
                  groupValue="status"
                  orderValue={ordering}
                  listTitle={listItem}
                  listIcon=""
                  statusList={statuses}
                  ticketDetails={ticketings}
                />
              )),
              user: users.map((listItem) => (
                <ColumnList
                  key={listItem.id}
                  groupValue="user"
                  orderValue={ordering}
                  listTitle={listItem.name}
                  listIcon=""
                  userList={users}
                  ticketDetails={ticketings}
                />
              )),
              priority: priorities.map((listItem) => (
                <ColumnList
                  key={listItem.priority}
                  groupValue="priority"
                  orderValue={ordering}
                  listTitle={listItem.priority}
                  listIcon=""
                  priorityList={priorities}
                  ticketDetails={ticketings}
                />
              )),
            }[groups]
          }
        </div>
      </section>
    </>
  );
}

export default App;
