import React, { useState, useContext } from "react";
import styles from "./auth.module.css";
import { useNavigate, Link } from "react-router-dom";
import { auth } from "../../Utility/firebase";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import swal from "sweetalert";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners"; // Added import
import { useCart } from "../../components/DataProvider/DataProvider";
import { ACTIONS } from "../../Utility/actions";

// Images
import logo from "../../assets/Images/logo2.png";
import BG1 from "../../assets/Images/login-BG.png";
import BG2 from "../../assets/Images/login-BG2.png";
import googleIcon from "../../assets/Images/google.png";

const provider = new GoogleAuthProvider();

const Signin = () => {
  const { dispatch } = useCart();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Added loading state for general button
  const [isGoogleLoading, setIsGoogleLoading] = useState(false); // Added loading state for Google button
  const [bgLoaded, setBgLoaded] = useState(false);
  const navigate = useNavigate();

  document.title = "Amazon";

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleEmailBlur = (e) => {
    if (
      e.target.value === "" ||
      !e.target.value.includes("@") ||
      !e.target.value.includes(".com")
    ) {
      setEmailError("Please enter a valid email address.");
    } else {
      setEmailError("");
    }
  };

  const handlePasswordBlur = (e) => {
    if (e.target.value === "") {
      setPasswordError("Please enter your password.");
    } else if (e.target.value.length < 4) {
      setPasswordError("Password is too small.");
    } else {
      setPasswordError("");
    }
  };

  const LogInUser = async () => {
    if (emailError || passwordError || !email || !password) return;
    setIsLoading(true); // Set loading true
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        dispatch({
          type: ACTIONS.SET_USER,
          user: userCredential.user,
        });
        toast.success("Signed in successfully!"); // Added toast
        navigate("/home");
      })
      .catch((error) => {
        toast.error(error.message); // Added toast
        swal({
          title: "Error!",
          text: error.message,
          icon: "error",
          buttons: "Ok",
        });
      })
      .finally(() => {
        setIsLoading(false); // Set loading false
      });
  };

  const GoogleAuth = async () => {
    setIsGoogleLoading(true); // Set loading true
    signInWithPopup(auth, provider)
      .then((userCredential) => {
        dispatch({
          type: ACTIONS.SET_USER,
          user: userCredential.user,
        });
        toast.success("Signed in successfully with Google!"); // Added toast
        navigate("/home");
      })
      .catch((error) => {
        toast.error(error.message); // Added toast
        swal({
          title: "Error!",
          text: error.message,
          icon: "error",
          buttons: "Ok",
        });
      })
      .finally(() => {
        setIsGoogleLoading(false); // Set loading false
      });
  };

  const handleBgLoad = () => setBgLoaded(true);

  return (
    <div className={styles.signinPage}>
      <div className={styles.loginNavbar}>
        <div className={styles.mainLogo}>
          <Link to="/">
            <img src={logo} className={styles.amazonLogo} alt="Amazon logo" />
          </Link>
        </div>
        <div>
          <Link to="/auth/signup">
            <button className={`${styles.signupBtn} ${styles.topBtn}`}>
              Sign up
            </button>
          </Link>
        </div>
      </div>
      <div className={styles.background}>
        <img src={BG1} className={styles.BG1} onLoad={handleBgLoad} alt="BG1" />
        <img src={BG2} className={styles.BG2} onLoad={handleBgLoad} alt="BG2" />
      </div>
      {bgLoaded && (
        <div className={styles.mainForm}>
          <div className={styles.loginForm}>
            <div className={styles.someText}>
              <p className={styles.user}>User Login</p>
              <p className={styles.userDesc}>
                Hey, Enter your details to get sign in to your account
              </p>
            </div>
            <div className={styles.userDetails}>
              <input
                type="email"
                placeholder="Enter Email"
                className={styles.email}
                value={email}
                onChange={handleEmailChange}
                onBlur={handleEmailBlur}
                required
              />
              {emailError && (
                <div className={styles.errorMessage}>{emailError}</div>
              )}
              <input
                type="password"
                placeholder="Password"
                className={styles.password}
                value={password}
                onChange={handlePasswordChange}
                onBlur={handlePasswordBlur}
                required
              />
              {passwordError && (
                <div className={styles.errorMessage}>{passwordError}</div>
              )}
              <button
                onClick={LogInUser}
                className={styles.signinBtn}
                disabled={isLoading || isGoogleLoading}
              >
                {isLoading ? (
                  <ClipLoader color="#ffffff" size={15} />
                ) : (
                  "Sign in"
                )}
              </button>
              <div className={styles.extraButtons}>
                <p className={styles.or}>&#x2015; Or &#x2015;</p>
                <button
                  onClick={GoogleAuth}
                  className={styles.google}
                  disabled={isLoading || isGoogleLoading}
                >
                  {isGoogleLoading ? (
                    <ClipLoader color="#000000" size={15} />
                  ) : (
                    <>
                      <p>Sign in with</p>
                      <img
                        src={googleIcon}
                        className={styles.googleImg}
                        alt="Google"
                      />
                    </>
                  )}
                </button>
              </div>
              <div className={styles.disclaimer}>
                By signing-in you agree to the{" "}
                <span className={styles.fakeHighlight}>
                  FAKE Conditions of Use &amp; Sale
                </span>
                .
                <br />
                Please see our{" "}
                <span className={styles.fakeHighlight}>Privacy Notice</span>,
                our <span className={styles.fakeHighlight}>Cookies Notice</span>{" "}
                and our{" "}
                <span className={styles.fakeHighlight}>
                  Interest-Based Ads Notice
                </span>
                .
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Signin;
