import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "../wallet/WalletDashboard.css";
import logo3 from "./logo3.png";
import Login from "./Login"; // Import the Login component
import SignupModal from "./SignupModal"; // Import the SignupModal component
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Terms() {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to manage menu visibility
  const sidebarRef = useRef();
  const uid = localStorage.getItem("userId");
  const [showLoginModal, setShowLoginModal] = useState(false); // State to manage login modal visibility
  const [showSignupModal, setShowSignupModal] = useState(false); // State to manage signup modal visibility
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to manage login status
  const [kycStatus, setKycStatus] = useState(""); // State to manage KYC status
  const id1 = localStorage.getItem("_id");
  const navigate = useNavigate();
  useEffect(() => {
    // Check if the user is logged in by checking the localStorage for authToken
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      setIsLoggedIn(true);
    }
  }, []);
  useEffect(() => {
    // Check if the user is logged in by checking the localStorage for authToken
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      setIsLoggedIn(true);
    }

    const fetchKycStatus = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/kyc/${id1}`
        );
        setKycStatus(response.data.status);
      } catch (error) {
        console.error("Error fetching KYC status:", error);
      }
    };

    if (uid) {
      fetchKycStatus();
    }
  }, [uid]);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const renderKycStatus = () => {
    if (kycStatus === "approved") {
      return (
        <p className="kyc-status">
          Verified{" "}
          <i className="fas fa-check-circle" style={{ color: "white" }}></i>
        </p>
      );
    }
    return null;
  };
  return (
    <div className="container">
      <header>
        <div
          className="title-container"
          style={{
            display: "flex",
            justifyContent: "space-evenly",
            width: "100%",
          }}
        >
          <button
            className="back-button"
            onClick={() => navigate(-1)}
            style={{
              marginRight: "10px",
              fontSize: "24px",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "white",
            }}
          >
            &#8592;
          </button>
          <h1>
            <Link to="/">TrustCoinFX</Link>
          </h1>

          <button className="menu-button" onClick={toggleMenu}>
            &#9776;
          </button>
        </div>
      </header>

      <div
        id="sidebar"
        className={`sidebar ${isMenuOpen ? "open" : ""}`}
        ref={sidebarRef}
      >
        <div className="sidebar-header">
          <img src={logo3} alt="logo" />
          <p>
            <b>UID: {uid}</b>
          </p>
          {renderKycStatus()}
        </div>

        <div className="functions">
          <ul>
            <li>
              <Link to="/wallet" className="link">
                <i className="fas fa-wallet"></i> Wallet
              </Link>
            </li>
            <li>
              <Link to="/tradepage">
                <i className="fas fa-exchange-alt"></i> Trade
              </Link>
            </li>
            <li>
              <Link to="/result">
                <i className="fas fa-chart-line"></i> Result
              </Link>
            </li>
            <li>
              <Link to="/transaction">
                <i className="fas fa-pen"></i> Transactions
              </Link>
            </li>
            <li>
              <Link to="/terms">
                <i className="fas fa-book"></i> Privacy Policy
              </Link>
            </li>
            <li>
              <button
                className="link"
                onClick={() => navigate("/profit-stats")}
              >
                <i className="fas fa-chart-bar"></i> Profit Statistics
              </button>
            </li>
          </ul>
          <div className="more-options">
            <ul>
              {isLoggedIn ? (
                <li>
                  <Link to="/settings">
                    <i className="fa-solid fa-gear"></i> Settings
                  </Link>
                </li>
              ) : (
                <li>
                  <button onClick={() => setShowLoginModal(true)}>
                    <i className="fa-solid fa-person"></i> Login
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      <div className="main-content">
        <div className="banner">
          <h2>Terms and Conditions</h2>
        </div>
        <div className="terms-content">
          <h3>
            1. The digital asset is not issued by any financial institution,
            company, or by this website itself.
          </h3>
          <p style={{ marginTop: "10px" }}></p>
          <h3>
            2. The digital asset market is relatively new and still in its
            infancy. It remains unconfirmed in terms of widespread acceptance
            and stability. Consequently, there is a possibility that it may not
            experience significant growth or achieve the anticipated levels of
            adoption and success.
          </h3>
          <p style={{ marginTop: "10px" }}></p>

          <h3>
            3. Digital assets are primarily utilized by speculators, with
            relatively limited use in retail and commercial markets.
            Transactions in digital assets carry extremely high risks. Trading
            occurs continuously throughout the day without any interruptions or
            price limits, making prices highly susceptible to manipulation by
            market makers and the influence of global governments. As a result,
            policy changes can cause significant price fluctuations.
          </h3>
          <p style={{ marginTop: "10px" }}></p>

          <h3>
            4. Digital asset trading carries extremely high risks and is not
            suitable for most people. You acknowledge that engaging in such
            transactions may result in partial or total loss of your investment.
            Therefore, you should only trade with an amount that you can afford
            to lose. You also understand that digital assets can involve
            derivative risks. If you have any doubts, it is recommended that you
            seek the assistance of a professional advisor before proceeding. In
            addition to the risks mentioned, there are also unpredictable risks.
            You should carefully consider these risks and use sound judgment to
            evaluate your financial situation before making any decision to buy
            or sell digital assets. You will bear all the losses arising from
            such decisions. We do not assume any responsibility for these
            losses.
          </h3>
          <p style={{ marginTop: "10px" }}></p>

          <h3>
            5. The company reserves the right to suspend or terminate your
            account at any time if it believes, at its sole discretion, that you
            have violated this agreement or that the services provided by this
            website, or your use of these services, are illegal according to the
            laws of your jurisdiction. This includes suspending or terminating
            your use of the services or digital asset transactions provided by
            this website.
          </h3>
          <p style={{ marginTop: "10px" }}></p>
          <h3>
            6. Any opinions, news, discussions, analysis, prices,
            recommendations, and other information provided on this website are
            intended as general market commentary and do not constitute
            investment advice. We are not responsible for any loss that results
            directly or indirectly from relying on this information, including
            but not limited to the loss of profits.
          </h3>
          <p style={{ marginTop: "10px" }}></p>
          <h3>
            7. There are inherent risks associated with using Internet-based
            trading systems, which include but are not limited to software,
            hardware, and internet connection failures. Due to the unpredictable
            nature of internet reliability and availability, we cannot be held
            responsible for distortions, delays, or failures in connectivity.
          </h3>
          <p style={{ marginTop: "10px" }}></p>

          <h3>
            8. The use of this website for malicious market manipulation, unfair
            trading practices, and other unethical activities is strictly
            prohibited. In the event of such incidents, this website reserves
            the right to issue warnings, impose restrictions on transactions,
            close accounts, and implement other preventive measures to protect
            the integrity of the trading system. We do not assume responsibility
            for any consequences arising from these actions and reserve the
            right to hold accountable parties responsible for their actions.
          </h3>
          <p style={{ marginTop: "10px" }}></p>
          <h3>1. General Rules:</h3>
          <h4>
            1.1 The &#39;User Agreement&#39; (hereinafter referred to as
            &#39;this agreement&#39; or &#39;these terms and conditions&#39;),
            incorporates the &#39;Privacy Terms,&#39; &#39;Know Your Customer
            and Anti-Money Laundering Policy,&#39; and other rules,
            declarations, and instructions published on this website, as well as
            those that may be issued in the future.
          </h4>
          <p style={{ marginTop: "10px" }}></p>
          <h4>
            1.2 Prior to utilizing the services offered on this website, it is
            imperative to thoroughly review this agreement. If you do not
            comprehend its terms, seek advice from a legal professional. If you
            disagree with or wish to amend this agreement at any time, please
            discontinue using the services provided by this website immediately
            or refrain from logging in. Logging in, using any services, or
            engaging in similar actions on this website signifies your complete
            understanding of and agreement to the terms of this agreement,
            including any revisions made by the website at any time.
          </h4>
          <p style={{ marginTop: "10px" }}></p>
          <h4>
            1.3 You can become a member of this website by registering
            successfully according to its requirements and completing other
            necessary procedures (referred to hereinafter as
            &quot;member&quot;). Its equivalent during website use, or actually
            using the provided services in other permissible ways, signifies
            full understanding, agreement, and acceptance of all terms under
            this agreement. A written signature is not required for this
            agreement to be legally binding.
          </h4>
          <p style={{ marginTop: "10px" }}></p>
          <h4>
            1.4 Once you become a member of this website, you will receive a
            member account and a corresponding password. It is your
            responsibility to maintain the security of your member account and
            password. You are legally accountable for all activities and events
            conducted using your account.
          </h4>
          <p style={{ marginTop: "10px" }}></p>
          <h4>
            1.5 Only registered members of this website can utilize its digital
            asset trading platform for transactions and access other exclusive
            services designated solely for members.
          </h4>
          <p style={{ marginTop: "10px" }}></p>
          <h4>
            1.6 By registering and using any services and functions provided by
            this website, you will be deemed to have read, understood and:
          </h4>
          <p style={{ marginTop: "10px" }}></p>
          <h4>1.6.1 Accept all terms and conditions of this agreement.</h4>
          <h5>
            1.6.2 You confirm that you are at least 16 years old or have reached
            the legal age required to enter into contracts according to
            applicable laws. Your actions on this website, such as registration,
            buying or selling, or posting information, must comply with the
            relevant laws and regulations of your jurisdiction. You have the
            full capacity to accept these terms, engage in transactions, and use
            this website for digital asset transactions.
          </h5>
          <h5>
            1.6.3 You warrant that the digital assets involved in the
            transaction are legally obtained and that you have rightful
            ownership of them.
          </h5>
          <h5>
            1.6.4 You agree to assume full responsibility for all gains or
            losses resulting from your trading or non-trading activities.
          </h5>
          <h5>
            1.6.5 You confirm that the information provided during registration
            is truthful and accurate.
          </h5>
          <h5>
            1.6.6 You agree to comply with all relevant laws, including tax
            regulations, and to report any trading profits as required.
          </h5>
          <h5>
            1.6 By registering and using any services and functions provided by
            this website, you will be deemed to have read, understood and:
          </h5>
          <h5>
            1.6.7 You agree to refrain from engaging in any activities that
            could harm the interests of this website or the company, whether or
            not they are related to the services provided here.
          </h5>
          <h5>
            1.6.8 This agreement solely governs the rights and obligations
            between you and us, and does not pertain to legal relationships
            between users of this website and other websites, nor does it
            address legal disputes arising from digital asset transactions.
          </h5>

          <h3>
            2 Revision of Agreement: We reserve the right to amend this
            agreement periodically and will announce changes on the website
            without separate notification. The revised agreement will indicate
            the time of change on its first page and will automatically take
            effect upon announcement on the website. You are responsible for
            regularly reviewing the updated terms and content of this agreement.
            If you do not agree to the changes, you must cease using this
            website&#39;s services immediately. Continued use of the services
            implies your acceptance and binding agreement to the revised terms.
          </h3>
          <p style={{ marginTop: "10px" }}></p>
          <h3>3 Registration:</h3>
          <h4>
            3.1 Registration Qualification: You confirm and commit that upon
            completing the registration process or using the services provided
            by this website in other permissible ways, you possess the legal
            capacity required by applicable laws to sign this agreement and
            utilize the website&#39;s services. This includes natural persons,
            legal entities, or other organizations with legal competency. By
            clicking the &quot;agree to register&quot; button, you acknowledge
            that you or your authorized representative has agreed to these terms
            on behalf of the registered entity and will use this website&#39;s
            services accordingly. If you lack the aforementioned qualifications,
            you and your authorized representative shall bear all resulting
            consequences. The company reserves the right to cancel or
            permanently freeze your account and to hold you and your authorized
            representative accountable.
          </h4>
          <p style={{ marginTop: "10px" }}></p>
          <h4>
            3.2 Purpose of Registration: You confirm and pledge that your
            registration on this website is not intended to violate laws and
            regulations or disrupt the order of digital asset transactions on
            this platform.
          </h4>
          <p style={{ marginTop: "10px" }}></p>
          <h4>3.3 Registration Process:</h4>
          <p style={{ marginTop: "10px" }}></p>
          <h5>
            3.3.1 You agree to provide valid email, mobile phone number, and
            other information as required on the user registration page of this
            website. Your mobile phone number may be used as a login method for
            accessing this website. As required by relevant laws and regulations
            in different jurisdictions, you must provide your real name,
            identity documents, and other information mandated by laws, privacy
            provisions, and anti- money laundering regulations, and continuously
            update this information to ensure it remains timely, detailed, and
            accurate. All information originally entered shall constitute your
            registration information. You are responsible for the authenticity,
            completeness, and accuracy of this information, and you shall bear
            any direct or indirect losses and adverse consequences resulting
            from it.
          </h5>
          <h5>
            3.3.2 You confirm that you have the legal authority, completeness,
            and effectiveness to provide the required registration information
            and verification, and that you have the right to obtain an account
            and password for this website. Upon obtaining the account and
            password, you are considered to have successfully registered and can
            log in as a member on this website.
          </h5>
          <h5>
            3.3.3 You consent to receiving emails and/or text messages sent by
            this website concerning its management and operation.
          </h5>
          <h3>4 Services:</h3>
          <h4>4.1 Service Content:</h4>
          <p style={{ marginTop: "10px" }}></p>
          <h5>
            4.1.1 You have the right to access real-time market and transaction
            information of various digital asset products on this website, to
            submit digital asset transaction instructions, and to complete
            digital asset transactions through this platform.
          </h5>
          <h5>
            4.1.2 You have the right to access and manage information under your
            member account on this website, and to utilize the functions
            provided by this website for operations.
          </h5>
          <h5>
            4.1.3 You have the right to participate in website activities
            organized by this website according to the rules published on the
            site.
          </h5>
          <h5>
            4.1.4 This website commits to providing you with additional
            services.
          </h5>
          <h4>
            4.2 Service Rules: You are obligated to adhere to the following
            service rules of this website:
          </h4>
          <h5>
            4.2.1 You must comply with laws and regulations and responsibly
            manage your account, login password, fund password, and mobile phone
            verification code received on your mobile device. You are fully
            liable for any actions and outcomes resulting from the use of your
            account number, login password, fund password, and mobile phone
            verification code. If you discover unauthorized use of your account,
            login password, fund password, verification code, or other security
            issues, you must promptly notify this website and request the
            suspension of your account service. This website reserves the right
            to act on your request within a reasonable timeframe, but it is not
            liable for any consequences (including but not limited to losses
            incurred by you) that occurred before taking action. You must not
            disclose, lend, rent, transfer, or otherwise dispose of your website
            account to others without the website&#39;s consent.
          </h5>
          <h5>
            4.2.2 You agree to take full responsibility for all activities
            conducted through your account and password on this website,
            including but not limited to information disclosure, publishing
            information, online consent or submission of various rules and
            agreements, online renewal of agreements, or purchasing services.
          </h5>
          <h5>
            4.2.3 When engaging in digital asset transactions on this website,
            you must refrain from maliciously disrupting the normal conduct of
            transactions or undermining transactional order. You must not
            interfere with the regular operations of this website or disrupt
            services to other users through technical means or other methods.
            Additionally, you must not discredit the goodwill of this website
            through the dissemination of fictitious information.
          </h5>
          <h5>
            4.2.4 If you have disputes with other users regarding online
            transactions, you agree not to request the website to provide
            relevant materials through judicial or administrative channels.
          </h5>
          <h5>
            4.2.5 You are solely responsible for judging and bearing any
            additional costs incurred during your use of the services provided
            by this website.
          </h5>
          <p style={{ marginTop: "10px" }}></p>
          <h4>4.3 Product Rules:</h4>
          <h5>
            4.3.1 When browsing transaction information on this website, you
            must carefully review all details included, such as prices,
            commission amounts, handling fees, and buying or selling directions.
            You fully acknowledge that the transaction information is
            comprehensive, and you accept it entirely before proceeding to trade
            by clicking the appropriate button.
          </h5>
          <h5>
            4.3.2 You have the ability to access and review detailed transaction
            records associated with your account. This includes viewing
            comprehensive information about past transactions, such as
            transaction dates, amounts, counterparties involved, transaction
            types (buying or selling), prices, fees, and any additional relevant
            details available through your account on this website.
          </h5>
          <p style={{ marginTop: "10px" }}></p>
          <h3>5 The rights and obligations of this website:</h3>
          <h4>
            5.1 If you do not meet the registration qualifications stipulated in
            this agreement, this website reserves the right to deny your
            registration. For registered users, this website reserves the right
            to cancel your member account and may hold you or your authorized
            agent accountable. Additionally, this website reserves the
            discretion to decide whether to accept your registration under any
            other circumstances.
          </h4>
          <h4>
            5.2 This website reserves the right, according to its own judgment,
            to suspend or terminate the use of your account and any associated
            accounts if you or the users associated with your account engage in
            activities deemed unsuitable for high-risk investments.
          </h4>
          <h4>
            5.3 This website reserves the right to suspend or terminate the use
            of an account if the user is not the original registrant of that
            account.
          </h4>
          <h4>
            5.4 This website reserves the right to notify you to correct,
            update, suspend, or terminate the provision of services if it
            reasonably suspects that the information you have provided is
            incorrect, untrue, invalid, or incomplete. This determination may be
            made through technical testing, manual sampling, or other testing
            methods.
          </h4>
          <h4>
            5.5 This website reserves the right to correct any information
            displayed on this website in the event of obvious errors.
          </h4>
          <h4>
            5.6 This website reserves the right to modify, suspend, or terminate
            its services at any time. Changes or suspensions to services may
            occur without prior notification. In the event of terminating one or
            more services, such termination takes effect from the date of the
            announcement posted on the website.
          </h4>
          <h4>
            5.7 This website will employ necessary technical means and
            management measures to ensure its smooth operation, providing a
            reliable trading environment and services to maintain the order of
            digital asset transactions.
          </h4>
          <h4>
            5.8 If you have not logged in to this website using your member
            account and password for one consecutive year, this website reserves
            the right to cancel your account. After cancellation, this website
            may open the corresponding member name for registration and use by
            other users.
          </h4>
          <h4>
            5.9 This website ensures the security of your digital assets by
            implementing measures such as enhancing technical infrastructure and
            improving security protocols. It will provide advance notice in the
            event of foreseeable security risks affecting your account.
          </h4>
          <h4>
            5.10 This website reserves the right to delete any content or
            information on this platform that does not comply with laws,
            regulations, or its own provisions at any time. Notification prior
            to exercising this right is not required.
          </h4>
          <h4>
            5.11 This website reserves the right to request additional
            information or data from you in accordance with the laws,
            regulations, rules, orders, and other norms of your sovereign
            country or region. You are obligated to cooperate with these
            requirements. Furthermore, this website may suspend or permanently
            cease to provide some or all services to you in accordance with the
            laws, regulations, rules, and orders of the sovereign countries or
            regions to which you belong.
          </h4>
          <p style={{ marginTop: "10px" }}></p>
          <h3>6 Limitation of Liability and Disclaimer:</h3>
          <h4>
            6.1 You understand and agree that under no circumstances will we be
            liable for the following issues:
          </h4>
          <h5>6.1.1 Loss of income;</h5>
          <h5>6.1.2 Trading profits or contract losses;</h5>
          <h5>6.1.3 Losses resulting from business interruption;</h5>
          <h5>6.1.4 The potential loss of currency savings;</h5>
          <h5>6.1.5 Losses resulting from issues with information;</h5>
          <h5>6.1.6 Loss of opportunity, goodwill, or reputation;</h5>
          <h5>6.1.7 Damage or loss of data;</h5>
          <h5>6.1.7 Damage or loss of data;</h5>
          <h5>
            6.1.9 Any indirect, special, or incidental loss or damage arising
            from infringement (including negligence), breach of contract, or any
            other cause, whether such loss or damage could reasonably be
            anticipated by us, regardless of whether we have been advised in
            advance of the possibility of such loss or damage.
          </h5>
          <h4>
            6.2 You understand and agree that we will not be liable for damages
            caused by any of the following circumstances, including but not
            limited to:
          </h4>
          <h5>
            6.2.1 Your specific transaction may constitute a significant
            violation of the law or breach of contract.
          </h5>
          <h5>
            6.2.2 Your actions on this website are suspected of being illegal or
            unethical.
          </h5>
          <h5>
            6.2.3 Expenses and losses arising from the purchase or acquisition
            of any data, information, transactions, or alternatives through the
            services of this website.
          </h5>
          <h5>6.2.4 Your misunderstanding of the services on this website.</h5>
          <h5>
            6.2.5 Any other losses not related to the services provided by this
            website that are not caused by our reasons.
          </h5>
          <h4>
            6.3 We are not liable for information network equipment maintenance,
            failures in information network connections, computer, communication
            or other system failures, power outages, weather conditions,
            accidents, strikes, labor disputes, riots, uprisings, shortages in
            production or materials, fires, floods, storms, explosions, wars,
            actions by banks or other partners, collapse of the digital asset
            market, government actions, judicial or administrative orders, or
            other events beyond our control or that we are unable to control. We
            are also not responsible for any inability to provide services or
            delays in service caused by third-party reasons, nor for any
            resulting losses to you.
          </h4>
          <h4>
            6.4 We cannot ensure that all information, programs, text, etc.,
            contained on this website are entirely immune to interference and
            destruction by malicious programs like viruses and Trojan horses.
            Therefore, your decision to log in, use any services of this
            website, or download and use any programs, information, data, etc.,
            carries personal risk and potential losses, for which you are solely
            responsible.
          </h4>
          <h4>
            6.5 We do not provide any guarantees or promises regarding the
            information, products, and services offered by any third-party
            websites linked to this website or any other content not belonging
            to our main body. If you choose to use services, information,
            products, etc., from third-party websites, it is your personal
            decision, and you accept full responsibility for any consequences
            that may arise.
          </h4>
          <h4>
            6.6 We do not provide any express or implied guarantees regarding
            your use of the services offered by this website. This includes but
            is not limited to the suitability of the services provided, absence
            of errors or omissions, continuity, accuracy, reliability, or
            applicability for any specific purpose. Additionally, we do not
            commit to or guarantee the validity, accuracy, correctness,
            reliability, quality, stability, completeness, or timeliness of the
            technology and information involved in the services provided by this
            website. Your decision to log in or use the services provided by
            this website is entirely voluntary, and you assume all associated
            risks and potential losses. We do not offer any express or implied
            guarantees regarding the market, value, or priceof digital assets.
            You acknowledge and understand that the digital asset market is
            volatile, with prices and values subject to fluctuation or collapse
            at any time. Trading digital assets is your personal choice and
            responsibility, and you bear all associated risks and potential
            losses.
          </h4>
          <h4>
            6.7 The guarantees and commitments outlined in this agreement
            represent the sole assurances and representations of the services
            provided by us on this website, superseding any guarantees and
            commitments made through any other means, whether written or oral,
            express or implied. These assurances and statements solely reflect
            our own commitments and guarantees and do not extend to ensuring
            third parties adhere to the guarantees and commitments outlined in
            this agreement.
          </h4>
          <h4>
            6.8 We reserve all rights not explicitly mentioned in this agreement
            to limit, exempt, or offset our liability for damages to the fullest
            extent permitted by law.
          </h4>
          <h4>
            6.9 Upon registration, you acknowledge that we will conduct
            operations in accordance with the rules outlined in this agreement,
            and any associated risks will be your responsibility.
          </h4>
          <p style={{ marginTop: "10px" }}></p>
          <h3>7 Termination of the agreement:</h3>
          <h4>
            7.1 This website reserves the right to terminate all services in
            accordance with this agreement. The agreement will terminate on the
            date when all services of this website are terminated.
          </h4>
          <h4>
            7.2 Upon termination of this agreement, you have no right to request
            this website to continue providing any services or fulfilling any
            other obligations. This includes, but is not limited to, requesting
            this website to retain or disclose any information from your
            original website account, forward any unread or sent information to
            you or a third party.
          </h4>
          <h4>
            7.3 Termination of this Agreement shall not prejudice the observant
            party&#39;s right to request the performance of other
            responsibilities.
          </h4>
          <p style={{ marginTop: "10px" }}></p>
          <h3>8 intellectual property rights</h3>
          <h4>
            8.1 All intellectual property found on this website, including but
            not limited to logos, databases, website design, text, graphics,
            software, photos, videos, music, sounds, and their combinations, as
            well as software compilation and relevant source code, are the
            exclusive property of this website. The intellectual property rights
            to software, including applets and scripts, also belong to this
            website. Any reproduction, modification, distribution, or commercial
            use of these materials or content is strictly prohibited without
            prior authorization.
          </h4>
          <h4>
            8.2 All rights, including but not limited to goodwill, trademarks,
            and logos associated with the name of this website, belong solely to
            the company.
          </h4>
          <h4>
            8.3 You must not illegally use or dispose of the intellectual
            property rights of this website or others while using the services
            of this website. You must not publish or authorize other websites
            (and media) to use the information published on this website in any
            form.
          </h4>
          <h4>
            8.4 Your access to this website or the use of any services provided
            by this website are not deemed to be any intellectual property
            rights transferred to you.
          </h4>
          <p style={{ marginTop: "10px" }}></p>
          <h3>
            9 Calculation: We have thoroughly verified all transaction
            calculation results. However, we cannot guarantee that the use of
            the website will be free from disruptions or errors.
          </h3>
          <p style={{ marginTop: "10px" }}></p>
          <h3>
            10 Divisibility: If any clause in this agreement is deemed
            unenforceable, invalid, or illegal by any court with jurisdiction,
            it shall not affect the validity of the remaining clauses of this
            agreement.
          </h3>
          <p style={{ marginTop: "10px" }}></p>
          <h3>
            Non-agent relationship: Nothing in this agreement shall be construed
            as creating, implying, or otherwise designating us as your agent,
            trustee, or representative, unless expressly provided for by other
            provisions in this agreement.
          </h3>
          <p style={{ marginTop: "10px" }}></p>
          <h3>
            12 Abstain: Our waiver of liability for breach of contract or other
            obligations as stipulated in this agreement shall not be construed
            or interpreted as a waiver of liability for any other breaches of
            contract. Furthermore, our failure to exercise any rights or
            remedies shall not be interpreted as a waiver of those rights or
            remedies.
          </h3>
          <p style={{ marginTop: "10px" }}></p>
          <h3>
            13 Title: The titles provided are for the convenience of expressing
            the agreement and do not serve to expand or limit the content or
            scope of the agreement&#39;s terms. Regarding the deposit agreement
            for others: Deposits of USDT, ETH, BTC, and other cryptocurrencies
            for third parties are strictly prohibited. Detection of such
            activity will result in severe penalties.
          </h3>
          <p style={{ marginTop: "10px" }}></p>
          <h3>14 The effectiveness and interpretation of the agreement:</h3>
          <h4>
            14.1 This agreement becomes effective when you click the consent
            button on the registration page of this website, complete the
            registration process, and receive your account number and password.
            This agreement is binding upon both this website and you.
          </h4>
          <h4>
            14.2 The final interpretation of this agreement belongs to this
            website.
          </h4>
          <h4>
            14.3 Individuals applying for account use must provide valid
            identification and payment accounts as required by the relevant GTM
            departments. An account will be opened for them upon approval by the
            relevant GTM departments. The GTM and its account can only be used
            by the approved account holder designated by the GTM issuing
            department and cannot be rented or transferred.
          </h4>
          <p style={{ marginTop: "10px" }}></p>
        </div>
      </div>
      {showLoginModal && <Login closeModal={() => setShowLoginModal(false)} />}

      {showSignupModal && (
        <SignupModal closeModal={() => setShowSignupModal(false)} />
      )}
    </div>
  );
}
