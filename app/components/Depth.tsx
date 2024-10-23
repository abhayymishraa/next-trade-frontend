
import { useEffect, useState } from "react";
import { getDepth, getTicker, getTrades } from "../utils/httpClient";
import { AskTable } from "./AskTable";
import { BidTable } from "./BidTable";
import { SignalingManager } from "../utils/SignalingManager";
import { Ticker } from "../utils/types";

export default function Depth({market} : {market: string}){
    const [bids, setBids] = useState<[string, string][]>();
    const [asks, setAsks] = useState<[string, string][]>();
    const [price, setPrice] = useState<string>();

    useEffect(()=>{

        SignalingManager.getInstance().registerCallback("ticker", (data: Partial<Ticker>) => {
            setPrice(data?.lastPrice ?? '');
        }, market);
        SignalingManager.getInstance().sendMessage({"method":"SUBSCRIBE","params":[`ticker.${market}`]}	);


       
        SignalingManager.getInstance().registerCallback("depth", (data: any) => {
            console.log(data);
            console.log(data.bids.length);
            console.log(data.asks.length);  

            // if(data.bids.length === 0 || data.asks.length === 0){
            //     getDepth(market).then((data)=>{
            //         setBids(data.bids.reverse());
            //         setAsks(data.asks);
            //     });
            //   return;
            // }
            setBids((originalBids) => {
                const updatedBids = [...(originalBids || [])];
            
                // Iterate through the new bids and update the list
                data.bids.forEach(([price, size]:any) => {
                    const bidIndex = updatedBids.findIndex(bid => bid[0] === price);
            
                    if (Number(size) === 0) {
                        // If size is 0, remove the bid
                        if (bidIndex !== -1) updatedBids.splice(bidIndex, 1);
                    } else {
                        if (bidIndex !== -1) {
                            // If the bid exists, update its size
                            updatedBids[bidIndex] = [price, size];
                        } else {
                            // If the bid doesn't exist, add it
                            updatedBids.push([price, size]);
                        }
                    }
                });
            
                // Sort bids in descending order of price
                updatedBids.sort((a, b) => Number(b[0]) - Number(a[0]));
            
                return updatedBids;
            });
            
            setAsks((originalAsks) => {
                const updatedAsks = [...(originalAsks || [])];
            
                // Iterate through the new asks and update the list
                data.asks.forEach(([price, size]:any) => {
                    const askIndex = updatedAsks.findIndex(ask => ask[0] === price);
            
                    if (Number(size) === 0) {
                        // If size is 0, remove the ask
                        if (askIndex !== -1) updatedAsks.splice(askIndex, 1);
                    } else {
                        if (askIndex !== -1) {
                            // If the ask exists, update its size
                            updatedAsks[askIndex] = [price, size];
                        } else {
                            // If the ask doesn't exist, add it
                            updatedAsks.push([price, size]);
                        }
                    }
                });
            
                // Sort asks in ascending order of price
                updatedAsks.sort((a, b) => Number(a[0]) - Number(b[0]));
            
                return updatedAsks;
            });
            
        }, `Depth-${market}`);


        SignalingManager.getInstance().sendMessage({"method":"SUBSCRIBE","params":[`depth.200ms.${market}`]});
        getDepth(market).then((data)=>{
            setBids(data.bids.reverse());
            setAsks(data.asks);
        });
        getTicker(market).then(t => setPrice(t.lastPrice));
        getTrades(market).then(t => setPrice(t[0].price));
        return () => {
            SignalingManager.getInstance().sendMessage({"method":"UNSUBSCRIBE","params":[`depth.200ms.${market}`]});
            SignalingManager.getInstance().deRegisterCallback("depth", `Depth-${market}`);
            SignalingManager.getInstance().deRegisterCallback("ticker", market);
            SignalingManager.getInstance().sendMessage({"method":"UNSUBSCRIBE","params":[`ticker.${market}`]}	);
        }
    },[]);



    return (
        <div>
          <TableHeader />
          {asks && <AskTable asks={asks} />}
          {price && <div>{price}</div>}
          {bids && <BidTable bids={bids} />}
        </div>
    )
}

function TableHeader() {
    return <div className="flex justify-between text-xs">
    <div className="text-white">Price</div>
    <div className="text-slate-500">Size</div>
    <div className="text-slate-500">Total</div>
</div>
}