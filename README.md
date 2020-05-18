


# Staking Bot Calculator 

The main idea of staking bot calculator is calculating
staking rewards of specific address and figuring two types of the rewards: referral and direct.

## Scripts reference

#### `echo.py`

Main script, start server on default port '8000' and waits for requests. Has only root route - `/`;

#### `run.sh`

Start bot on default port.

#### Package.json and *.js files

NPM can be also initialised optionally if you need to run tests.

#### Start example

On default port
>`python3 echo.py`

On specified port
>`python3 echo.py 8005`

### Request example
```
curl -X POST --data '{"payments":[{"recipient":"3P2qrqPXWfsrX7uZidpRcYu35r81UGjHehB","amount":1000000000},{"recipient":"3P3K39AP3yWfPUALfbNFRLKtNfCmGxpN8hE","amount":2000000000},{"recipient":"3P3eFkKKZ42a7dDtvKrJ5ZWNak5a2T4VNCW","amount":3000000000}]}' -H 'Content-Type: application/json' http://172.105.72.70:8009
```

### Response of provided request

```
{"direct": [{"recipient": "3P2qrqPXWfsrX7uZidpRcYu35r81UGjHehB", "amount": 800000000}, {"recipient": "3P3eFkKKZ42a7dDtvKrJ5ZWNak5a2T4VNCW", "amount": 2400000000}, {"recipient": "3P3K39AP3yWfPUALfbNFRLKtNfCmGxpN8hE", "amount": 1600000000}], "ref": [{"recipient": "3PKn6rTtDPwbP1a6DtmQYfeRL4bntwUt8W1", "amount": 600000000}, {"recipient": "3P3F2MZzebicC9iJvXH5Puv7qDnuUiryB4r", "amount": 200000000}, {"recipient": "3PCS2Zi2WKtsuH9irkYGA5fN16epE9EhVBQ", "amount": 400000000}]}
```

## Deployment

Simply copy systemd service providing desired name.

For i.g.:

Copy service to systemd directory (default port specified in service file is 8009):
> cp systemd/example.service /etc/systemd/system/staking-rc.service

By the way, filename is crucial, the way you name service file depends on how we'll start it.
Start the bot:
> service staking-rc start

Check status
> service staking-rc status

Schedule service start on system boot

> systemctl enable staking-rc

[Systemd service example](systemd/examle.service)

## Request & Response types

Server waits for specific payload. Basically, dictionary with key 'payments' with specified array of address rewards. This array gets usually passed from node payout manager. If `ref` array is empty in response body, that means that `none of recipients ` provided in request body have referrals.

#### Type reference (TS example)

```
type Payment = { 
	recipient: string;
	amount: number;
 }
```

#### Request body reference
| Key | Value | Description
|-------|-------|-----|
| `payments` | `Payment[]` | `Array of payments`

#### Response body reference
| Key | Value | Description
|-------|-------|-----|
| `direct` | `Payment[]` | `Array of direct payments`
| `ref` | `Payment[]` | `Array of referral payments`


