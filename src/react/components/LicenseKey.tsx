import React, { useState, useEffect } from "react";
import { LicenseService } from "../../features/authenticate/license.service";
import { getConnection } from "typeorm";
import { ipcRenderer } from "electron";

const LicenseSetup = () => {
  const [licenseKey, setLicenseKey] = useState("");
  const [pin, setPin] = useState("");
  const [mode, setMode] = useState<"enterKey" | "setupPin" | "success">(
    "enterKey"
  );
  const [statusMessage, setStatusMessage] = useState("");
  const [isPinRequired, setIsPinRequired] = useState(false);

  const handleLicenseKeyChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setLicenseKey(event.target.value);
  };

  const handlePinChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPin(event.target.value);
  };

  useEffect(() => {
    const checkForPin = async () => {
      const licensesWithPin = await (window as any).electron.invoke(
        "get-licenses-with-pin"
      );
      setIsPinRequired(licensesWithPin.length > 0);
      if (licensesWithPin.length > 0)
        setLicenseKey(licensesWithPin[0].licenseKey);
    };

    checkForPin();
  }, []);

  const handleSubmitKey = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatusMessage("");

    try {
      const isValid = await (window as any).electron.invoke(
        "validate-license-key",
        { key: licenseKey }
      );

      if (isValid) {
        setMode("setupPin");
      } else {
        setStatusMessage("Invalid License Key");
      }
    } catch (error) {
      console.log(error);
      setStatusMessage("An error occurred. Please try again.");
    }
  };

  const handleSubmitPin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatusMessage("");

    try {
      const pinSetSuccess = await (window as any).electron.invoke(
        "set-pin-for-license",
        { key: licenseKey, pin }
      );

      if (pinSetSuccess) {
        setMode("success");
      } else {
        setStatusMessage(
          "PIN has already been set for this key or an error occured."
        );
      }
    } catch (error) {
      setStatusMessage("An error occurred. Please try again.");
    }
  };

  const handleLoginPin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatusMessage("");

    try {
      const isValidPin = await (window as any).electron.invoke("check-pin", {
        key: licenseKey,
        pin,
      });
      if (isValidPin) {
        (window as any).electron.setLoginState(true); // Set user as logged in
        // Redirect to the main application screen or implement relevant logic here
        setStatusMessage("pin correct");
      } else {
        setStatusMessage("Invalid PIN");
      }
    } catch (error) {
      console.log(error);
      setStatusMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div>
      {isPinRequired ? (
        // Render the PIN input form
        <form onSubmit={handleLoginPin}>
          <h1>Enter Your PIN</h1>
          <input type="password" value={pin} onChange={handlePinChange} />
          <button type="submit">Login</button>
          {statusMessage && <p className="error-message">{statusMessage}</p>}
        </form>
      ) : (
        <>
          {mode === "enterKey" && (
            <form onSubmit={handleSubmitKey}>
              <h1>Enter License Key</h1>
              <input
                type="text"
                value={licenseKey}
                onChange={handleLicenseKeyChange}
              />
              <button type="submit">Next</button>
              {statusMessage && (
                <p className="error-message">{statusMessage}</p>
              )}
            </form>
          )}

          {mode === "setupPin" && (
            <form onSubmit={handleSubmitPin}>
              <h1>Set Your Pin</h1>
              <input type="password" value={pin} onChange={handlePinChange} />
              <button type="submit">Save</button>
              {statusMessage && (
                <p className="error-message">{statusMessage}</p>
              )}
            </form>
          )}

          {mode === "success" && (
            <div>
              <h1>Success!</h1>
              <p>Your PIN has been saved.</p>
            </div>
          )}
        </>
      )}
      <button onClick={() => setMode("enterKey")}> Go back</button>
    </div>
  );
};

export default LicenseSetup;
