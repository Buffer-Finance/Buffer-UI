<p  style="display:flex;align-items:center">
<a href="https://buffer.finance" target="blank"><img align="center" src="https://cdn.buffer.finance/Buffer-Media/main/bfr.png" alt="harshalmaniya2" height="30" width="30" /></a> 
</p>

# Buffer Finance
## Decentralized Trading Platform
To run this project locally

- Install Dependencies
<code>yarn install</code>
- Configure App
<b>Either</b>
Create a file named <code>.env.local</code> with content:
<code>VITE_ENV = MAINNET
VITE_MODE = developement
BASE_PATH = public</code>\
<b>OR</b>\
Rename <code>.env.sample</code> -> <code>.env.local</code>\
\*You can set VITE_ENV to TESTNET also.
- Start Developement Server
Run <code>yarn dev</code> from terminal

##### What we used for
<ol>
<li>Wallet Connection</li>
For wallet connection we used <a href="https://www.rainbowkit.com/docs/introduction">RainbowKit</a>. It provides a cleaner interface for connection while hiding the sheer complexities (different wallet providers, Network not present, Handling Connection states etc…) involved in wallet connection.
<li>Contract Interaction</li>
For this we used <a href="https://wagmi.sh/">wagmi</a> hooks.<br />
<ul>
<li>
For executing <b>Write-Calls</b>
We specifically used <a href="https://wagmi.sh/cli/plugins/react#usecontract-optional">this</a> hook to create a ethers.js like <a href="https://docs.ethers.org/v5/api/contract/contract/#contract-functionsSend">contract instance</a>  in this <a href="https://github.com/Buffer-Finance/Buffer-UI/blob/edf8f8c1c4aa4534376aa75d359a509f1fe3a42b/src/Hooks/useWriteCall.ts">service</a>
For Read-Calls
We have a specific requirement to use the user's wallets injected connector’s rpc for read calls if connected.
We also used swr for caching and revalidating data.
These 2 things are implemented inside this service,
</li>
<li>
For executing <b>Read-Calls</b>.
We have a specific requirement to use the user's wallets injected connector’s rpc for read calls if connected. So we implemented our own <a href="https://github.com/Buffer-Finance/Buffer-UI/blob/edf8f8c1c4aa4534376aa75d359a509f1fe3a42b/src/Utils/useReadCall.ts">service</a> using <a href="https://swr.vercel.app/">swr</a>.
</li>

</ul>
<li>Trading View</li>
How we integrated it:
<ol>

<li>
Get access to their widget’s github repo by clicking on “Get Library” under Technical Analysis Charts section from <a href="https://www.google.com/url?q=https://in.tradingview.com/HTML5-stock-forex-bitcoin-charting-library/?feature%3Dtechnical-analysis-charts&sa=D&source=docs&ust=1678355057052437&usg=AOvVaw103BtTt4qNYQD9g_auPYaz">here</a>
</li>


<li>
Copy/Paste there static/charting_library folder into your project’s public directory.
</li>
<li>
Integrate there static files into you dynamic react component - They have one example with plain old React’s Class Based Components but we are heavily using Functional Components and custom hooks in our repo. So we converted there example into Functional Components. You can have a look at integration from <a href="https://github.com/Buffer-Finance/Buffer-UI/blob/1769fa4526c3c9088a1510c3691095e1f5fcfe9c/src/TradingView.tsx">here</a>.
</li>
<li>
Write a JS-API which serves as a data-feed for your TradingView.
 This API should contain 5-6 mandatory methods which TradingView expects us to implement. We named that as a datafeed <a href="https://github.com/Buffer-Finance/Buffer-UI/blob/1769fa4526c3c9088a1510c3691095e1f5fcfe9c/src/TradingView.tsx">here</a>
</li>
<li>
Visualise positions using their APIs - Code is in same file.
</li>
<li>
Implement an auto-save mechanism for drawings on TradingView.
</li>

</ol>




</ul>

</ol>








Connect with us on
 <p align="left">
<a href="https://twitter.com/Buffer_Finance?ref_src=twsrc%5Egoogle%7Ctwcamp%5Eserp%7Ctwgr%5Eauthor" target="blank"><img align="center" src="https://raw.githubusercontent.com/rahuldkjain/github-profile-readme-generator/master/src/images/icons/Social/twitter.svg" alt="twiiter link" height="30" width="40" /></a>
<a href="https://t.me/bufferfinance" target="blank"><img align="center" src="https://cdn3.iconfinder.com/data/icons/popular-services-brands-vol-2/512/telegram-512.png" alt="twiiter link" height="30" width="30" /></a>

</p>

