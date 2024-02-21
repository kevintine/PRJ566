import React, { useState } from "react";
import { Table } from "react-bootstrap";
import axios from "axios";
import "./bowlingScoreDisplay.css";

const BowlingScoreDisplay = ({ onGameIdChange }) => {
  const [showTable, setShowTable] = useState(false);
  const [users, setUsers] = useState([]);
  const [gameId, setGameId] = useState(null);

  const handlePopulateTable = async () => {
    try {
      let numberOfUsers;
      // Send a request to your backend API with the bowlingAlleyNumber as a URL parameter
      const usersResponse = await axios.get("http://localhost:8080/tempUsers/1");
      if (usersResponse.status === 200) {
        const usersData = usersResponse.data; // Assuming response.data contains the array of users
        setUsers(usersData);
        numberOfUsers = usersData.length; // Get the number of users
        setShowTable(true);
      } else {
        console.error("Failed to fetch users");
      }

      // Send a request to your backend API with the bowlingAlleyNumber as a URL parameter
      const response = await axios.post(`http://localhost:8080/create-new-game/1/${numberOfUsers}`);

      // Check if the request was successful
      if (response.status === 200) {
        // Toggle the showTable state to true
        setShowTable(true);
        
        // Extract the gameId from the response data
        const { gameId } = response.data;

        // Set the gameId in the component state
        setGameId(gameId);

        onGameIdChange(gameId);
      } else {
        // Handle error if the request was not successful
        console.error("Failed to initialize game");
      }
    } catch (error) {
      // Handle any errors that occur during the request
      console.error("Error initializing game:", error);
    }

    setShowTable(true);
  };
  return (
    <div>
      <h2>Bowling Score Display</h2>
      <Table bordered className="bowling-table">
        <thead>
          <tr>
            <th
              className="text-center"
              style={{
                backgroundColor: "darkgreen",
                color: "lightgreen",
                border: "1px solid black",
              }}
            >
              Name
            </th>
            <th
              className="text-center"
              style={{
                backgroundColor: "darkgreen",
                color: "lightgreen",
                border: "1px solid black",
              }}
            >
              1
            </th>
            <th
              className="text-center"
              style={{
                backgroundColor: "darkgreen",
                color: "lightgreen",
                border: "1px solid black",
              }}
            >
              2
            </th>
            <th
              className="text-center"
              style={{
                backgroundColor: "darkgreen",
                color: "lightgreen",
                border: "1px solid black",
              }}
            >
              3
            </th>
            <th
              className="text-center"
              style={{
                backgroundColor: "darkgreen",
                color: "lightgreen",
                border: "1px solid black",
              }}
            >
              4
            </th>
            <th
              className="text-center"
              style={{
                backgroundColor: "darkgreen",
                color: "lightgreen",
                border: "1px solid black",
              }}
            >
              5
            </th>
            <th
              className="text-center"
              style={{
                backgroundColor: "darkgreen",
                color: "lightgreen",
                border: "1px solid black",
              }}
            >
              6
            </th>
            <th
              className="text-center"
              style={{
                backgroundColor: "darkgreen",
                color: "lightgreen",
                border: "1px solid black",
              }}
            >
              7
            </th>
            <th
              className="text-center"
              style={{
                backgroundColor: "darkgreen",
                color: "lightgreen",
                border: "1px solid black",
              }}
            >
              8
            </th>
            <th
              className="text-center"
              style={{
                backgroundColor: "darkgreen",
                color: "lightgreen",
                border: "1px solid black",
              }}
            >
              9
            </th>
            <th
              className="text-center"
              style={{
                backgroundColor: "darkgreen",
                color: "lightgreen",
                border: "1px solid black",
              }}
            >
              Total.
            </th>
          </tr>
        </thead>
        <tbody>
          {showTable &&
            users.map((user, index) => (
              <tr key={index}>
                <td
                  className="text-center fixed-width-name align-middle"
                  style={{
                    backgroundColor: "darkred",
                    color: "orange",
                    border: "1px solid black",
                    fontSize: "28px",
                    fontWeight: "bold",
                  }}
                >
                  {user.username}
                </td>{" "}
                {/* Name column */}
                <td
                  style={{
                    backgroundColor: "darkred",
                    color: "orange",
                    border: "1px solid black",
                  }}
                >
                  <Table
                    className="inner-table"
                    bordered
                    style={{ lineHeight: "20px" }}
                  >
                    <tbody>
                      <tr>
                        <td
                          className="text-center"
                          style={{
                            backgroundColor: "darkred",
                            color: "white",
                            fontSize: "28px",
                            fontWeight: "bold",
                          }}
                        >
                          1
                        </td>
                        <td
                          className="text-center"
                          style={{
                            backgroundColor: "darkred",
                            color: "white",
                            fontSize: "28px",
                            fontWeight: "bold",
                          }}
                        >
                          2
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                  <Table
                    className="inner-table"
                    bordered
                    style={{ lineHeight: "20px" }}
                  >
                    <tbody>
                      <tr>
                        <td
                          className="text-center"
                          style={{
                            backgroundColor: "darkred",
                            color: "orange",
                            fontSize: "28px",
                            fontWeight: "bold",
                          }}
                        >
                          X
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </td>
                <td
                  style={{
                    backgroundColor: "darkred",
                    color: "orange",
                    border: "1px solid black",
                  }}
                >
                  <Table
                    className="inner-table"
                    bordered
                    style={{ lineHeight: "20px" }}
                  >
                    <tbody>
                      <tr>
                        <td
                          className="text-center"
                          style={{
                            backgroundColor: "darkred",
                            color: "white",
                            fontSize: "28px",
                            fontWeight: "bold",
                          }}
                        >
                          1
                        </td>
                        <td
                          className="text-center"
                          style={{
                            backgroundColor: "darkred",
                            color: "white",
                            fontSize: "28px",
                            fontWeight: "bold",
                          }}
                        >
                          2
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                  <Table
                    className="inner-table"
                    bordered
                    style={{ lineHeight: "20px" }}
                  >
                    <tbody>
                      <tr>
                        <td
                          className="text-center"
                          style={{
                            backgroundColor: "darkred",
                            color: "orange",
                            fontSize: "28px",
                            fontWeight: "bold",
                          }}
                        >
                          X
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </td>
                <td
                  style={{
                    backgroundColor: "darkred",
                    color: "orange",
                    border: "1px solid black",
                  }}
                >
                  <Table
                    className="inner-table"
                    bordered
                    style={{ lineHeight: "20px" }}
                  >
                    <tbody>
                      <tr>
                        <td
                          className="text-center"
                          style={{
                            backgroundColor: "darkred",
                            color: "white",
                            fontSize: "28px",
                            fontWeight: "bold",
                          }}
                        >
                          1
                        </td>
                        <td
                          className="text-center"
                          style={{
                            backgroundColor: "darkred",
                            color: "white",
                            fontSize: "28px",
                            fontWeight: "bold",
                          }}
                        >
                          2
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                  <Table
                    className="inner-table"
                    bordered
                    style={{ lineHeight: "20px" }}
                  >
                    <tbody>
                      <tr>
                        <td
                          className="text-center"
                          style={{
                            backgroundColor: "darkred",
                            color: "orange",
                            fontSize: "28px",
                            fontWeight: "bold",
                          }}
                        >
                          X
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </td>
                <td
                  style={{
                    backgroundColor: "darkred",
                    color: "orange",
                    border: "1px solid black",
                  }}
                >
                  <Table
                    className="inner-table"
                    bordered
                    style={{ lineHeight: "20px" }}
                  >
                    <tbody>
                      <tr>
                        <td
                          className="text-center"
                          style={{
                            backgroundColor: "darkred",
                            color: "white",
                            fontSize: "28px",
                            fontWeight: "bold",
                          }}
                        >
                          1
                        </td>
                        <td
                          className="text-center"
                          style={{
                            backgroundColor: "darkred",
                            color: "white",
                            fontSize: "28px",
                            fontWeight: "bold",
                          }}
                        >
                          2
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                  <Table
                    className="inner-table"
                    bordered
                    style={{ lineHeight: "20px" }}
                  >
                    <tbody>
                      <tr>
                        <td
                          className="text-center"
                          style={{
                            backgroundColor: "darkred",
                            color: "orange",
                            fontSize: "28px",
                            fontWeight: "bold",
                          }}
                        >
                          X
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </td>
                <td
                  style={{
                    backgroundColor: "darkred",
                    color: "orange",
                    border: "1px solid black",
                  }}
                >
                  <Table
                    className="inner-table"
                    bordered
                    style={{ lineHeight: "20px" }}
                  >
                    <tbody>
                      <tr>
                        <td
                          className="text-center"
                          style={{
                            backgroundColor: "darkred",
                            color: "white",
                            fontSize: "28px",
                            fontWeight: "bold",
                          }}
                        >
                          1
                        </td>
                        <td
                          className="text-center"
                          style={{
                            backgroundColor: "darkred",
                            color: "white",
                            fontSize: "28px",
                            fontWeight: "bold",
                          }}
                        >
                          2
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                  <Table
                    className="inner-table"
                    bordered
                    style={{ lineHeight: "20px" }}
                  >
                    <tbody>
                      <tr>
                        <td
                          className="text-center"
                          style={{
                            backgroundColor: "darkred",
                            color: "orange",
                            fontSize: "28px",
                            fontWeight: "bold",
                          }}
                        >
                          X
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </td>
                <td
                  style={{
                    backgroundColor: "darkred",
                    color: "orange",
                    border: "1px solid black",
                  }}
                >
                  <Table
                    className="inner-table"
                    bordered
                    style={{ lineHeight: "20px" }}
                  >
                    <tbody>
                      <tr>
                        <td
                          className="text-center"
                          style={{
                            backgroundColor: "darkred",
                            color: "white",
                            fontSize: "28px",
                            fontWeight: "bold",
                          }}
                        >
                          1
                        </td>
                        <td
                          className="text-center"
                          style={{
                            backgroundColor: "darkred",
                            color: "white",
                            fontSize: "28px",
                            fontWeight: "bold",
                          }}
                        >
                          2
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                  <Table
                    className="inner-table"
                    bordered
                    style={{ lineHeight: "20px" }}
                  >
                    <tbody>
                      <tr>
                        <td
                          className="text-center"
                          style={{
                            backgroundColor: "darkred",
                            color: "orange",
                            fontSize: "28px",
                            fontWeight: "bold",
                          }}
                        >
                          X
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </td>
                <td
                  style={{
                    backgroundColor: "darkred",
                    color: "orange",
                    border: "1px solid black",
                  }}
                >
                  <Table
                    className="inner-table"
                    bordered
                    style={{ lineHeight: "20px" }}
                  >
                    <tbody>
                      <tr>
                        <td
                          className="text-center"
                          style={{
                            backgroundColor: "darkred",
                            color: "white",
                            fontSize: "28px",
                            fontWeight: "bold",
                          }}
                        >
                          1
                        </td>
                        <td
                          className="text-center"
                          style={{
                            backgroundColor: "darkred",
                            color: "white",
                            fontSize: "28px",
                            fontWeight: "bold",
                          }}
                        >
                          2
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                  <Table
                    className="inner-table"
                    bordered
                    style={{ lineHeight: "20px" }}
                  >
                    <tbody>
                      <tr>
                        <td
                          className="text-center"
                          style={{
                            backgroundColor: "darkred",
                            color: "orange",
                            fontSize: "28px",
                            fontWeight: "bold",
                          }}
                        >
                          X
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </td>
                <td
                  style={{
                    backgroundColor: "darkred",
                    color: "orange",
                    border: "1px solid black",
                  }}
                >
                  <Table
                    className="inner-table"
                    bordered
                    style={{ lineHeight: "20px" }}
                  >
                    <tbody>
                      <tr>
                        <td
                          className="text-center"
                          style={{
                            backgroundColor: "darkred",
                            color: "white",
                            fontSize: "28px",
                            fontWeight: "bold",
                          }}
                        >
                          1
                        </td>
                        <td
                          className="text-center"
                          style={{
                            backgroundColor: "darkred",
                            color: "white",
                            fontSize: "28px",
                            fontWeight: "bold",
                          }}
                        >
                          2
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                  <Table
                    className="inner-table"
                    bordered
                    style={{ lineHeight: "20px" }}
                  >
                    <tbody>
                      <tr>
                        <td
                          className="text-center"
                          style={{
                            backgroundColor: "darkred",
                            color: "orange",
                            fontSize: "28px",
                            fontWeight: "bold",
                          }}
                        >
                          X
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </td>
                <td
                  style={{
                    backgroundColor: "darkred",
                    color: "orange",
                    border: "1px solid black",
                  }}
                >
                  <Table
                    className="inner-table"
                    bordered
                    style={{ lineHeight: "20px" }}
                  >
                    <tbody>
                      <tr>
                        <td
                          className="text-center"
                          style={{
                            backgroundColor: "darkred",
                            color: "white",
                            fontSize: "28px",
                            fontWeight: "bold",
                          }}
                        >
                          1
                        </td>
                        <td
                          className="text-center"
                          style={{
                            backgroundColor: "darkred",
                            color: "white",
                            fontSize: "28px",
                            fontWeight: "bold",
                          }}
                        >
                          2
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                  <Table
                    className="inner-table"
                    bordered
                    style={{ lineHeight: "20px" }}
                  >
                    <tbody>
                      <tr>
                        <td
                          className="text-center"
                          style={{
                            backgroundColor: "darkred",
                            color: "orange",
                            fontSize: "28px",
                            fontWeight: "bold",
                          }}
                        >
                          X
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </td>
                <td
                  className="text-center fixed-width-name align-middle"
                  style={{
                    backgroundColor: "darkred",
                    color: "yellow",
                    border: "1px solid black",
                    fontSize: "28px",
                    fontWeight: "bold",
                  }}
                >
                  300
                </td>{" "}
                {/* Name column */}
              </tr>
            ))}
        </tbody>
      </Table>
      {!showTable && (
        <button onClick={handlePopulateTable}>Populate Table</button>
      )}
    </div>
  );
};

export default BowlingScoreDisplay;
