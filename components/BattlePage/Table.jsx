import React from "react";
import FavButton from "../FavButton";
import EditName from "./EditNameDev";

const Table = ({ user, data, country, showPopup }) => {
  function tensPlace(coord) {
    coord = coord.toString();
    if (coord.length > 5) {
      coord = coord.slice(0, 5);
    }
    return parseFloat(coord);
  }

  function battleHasLoc(latLon) {
    return [tensPlace(latLon[0]), tensPlace(latLon[1])];
  }

  const copyToClipboard = (txt) => {
    navigator.clipboard.writeText(txt);
    alert("Location copied to clipboard: " + txt);
  };

  function extractYear(name) {
    let num = "";
    let lastletter = "1";
    for (let index = 0; index < name.length; index++) {
      const element = name[index];
      if (parseInt(element) || element == "0") {
        if (!parseInt(lastletter) && lastletter != "0") {
          // console.log("deleting: ", num, element, lastletter);
          num = "";
        }
        num += element;
      }
      if (lastletter + element == "BC") num = "-" + num;
      lastletter = element;
    }
    return num;
  }

  function setYear(battleData, battleArr) {
    let year = "year" in battleData ? battleData["year"] : battleArr[1];
    // if (year < 0) year = String((year *= -1)).concat(" BC");

    if (!parseInt(year) && battleArr.length >= 2) {
      year = battleArr[2];
    }
    if (!parseInt(year)) year = extractYear(battleArr[0]);
    return year;
  }

  return (
    <table>
      <tbody>
        <tr>
          <th></th>
          <th>Battle</th>
          {user.loggedIn && <th></th>}
          <th>Year</th>
          <th>Location</th>
          <th></th>
        </tr>

        {data.map((battleData, index) => {
          let battle = battleData["name"];

          let battleArr = battle.split(" – ");
          let name = battleArr[0];

          const battleCoords =
            "latLon" in battleData ? battleHasLoc(battleData["latLon"]) : "";
          let year = setYear(battleData, battleArr);

          return (
            <tr key={name + index}>
              <td className="text-center">{index + 1}</td>
              <td className={battleCoords ? "bg-green-500" : "bg-red-500"}>
                {/* <battleArr
                  href={
                    "https://en.wikipedia.org/wiki/" +
                    battleArr[0].split(" or ")[0].replace(" ", "_")
                  }
                  target="_blank"
                  className="learnMoreBtn"
                >
                  clickme
                </battleArr> */}
                {name.split(" or ")[0]}
              </td>
              {user.loggedIn && (
                <td>
                  <FavButton battle={battle} country={country} user={user} />
                </td>
              )}
              <td className="text-center">
                {year}
                {!parseInt(year) && <>nodata</>}
              </td>
              <td>
                {battleCoords ? (
                  <div className="flex">
                    <button
                      className="flex-1"
                      title="Copy to Clipboard"
                      onClick={() => copyToClipboard(battleCoords)}
                    >
                      [{battleCoords[0]}, {battleCoords[1]}]
                    </button>
                  </div>
                ) : (
                  <button
                    className="w-full"
                    title="Add Location Data"
                    onClick={() => showPopup(battle, "add", index, year)}
                    disabled={!user.loggedIn}
                  >
                    {user.loggedIn && user.perms.addLoc ? (
                      <>Add</>
                    ) : (
                      <>Suggest</>
                    )}
                  </button>
                )}
              </td>
              {user.loggedIn && (
                <td>
                  {user.perms.editData && (
                    <button
                      onClick={() => showPopup(battleArr, "edit", index, year)}
                    >
                      Edit
                    </button>
                  )}
                  {user.perms.reportData && (
                    <button onClick={() => showPopup(battle, "report", index)}>
                      Report
                    </button>
                  )}
                </td>
              )}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default Table;
