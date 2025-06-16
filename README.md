<p align="center">
  <a href="https://docs.zbdpay.com">
    <img src="https://avatars.githubusercontent.com/u/54384134?s=200&v=4" height="96" />
    <h3 align="center">ZBD API Docs</h3>
  </a>
</p>

<div align="center">
  
[![bitcoin ln payments](https://img.shields.io/badge/Bitcoin%20Lightning-Payments-orange?style=for-the-badge&logo=bitcoin)](https://zebedee.io)
  
</div>

<p align="center">
  Instant Bitcoin Payment APIs
</p>

<p align="center">
  <a href="https://docs.zbdpay.com"><strong>Documentation</strong></a> ·
  <a href="https://dashboard.zbdpay.com"><strong>Developer Dashboard</strong></a> ·
  <a href="https://docs.zbdpay.com/payments/api"><strong>API Reference</strong></a> ·
  <a href="https://status.zbdpay.com"><strong>API Status</strong></a>
</p>
<br/>

## ZBD

ZBD is the payments platform for modern developers, providing the speed and reliability innovators need to create monetized and meaningfully-engaging user experiences.

We enable businesses and consumers to quickly introduce instantaneous Bitcoin payments to the fabric of their applications, games, and platforms. ZBD has the most comprehensive set of Bitcoin Lightning API capabilities and is industry-leader in supporting companies in the fields of gaming, social, adtech and fintech.

With ZBD, it's easy! Anyone can do it. **[What are YOU building?](https://dashboard.zbdpay.com)**

## Contributing

### Development

Install the [Mintlify CLI](https://www.npmjs.com/package/mintlify) to preview the documentation changes locally. To install, use the following command

```
npm i -g mintlify
```

Run the following command at the root of the repository (where mint.json is)

```
mintlify dev
```

### Deployment

Changes will be deployed to production automatically after pushing to `main` branch.

You can also preview changes using PRs, which generates a preview link of the docs.

#### Troubleshooting

- Mintlify dev isn't running - Run `mintlify install` it'll re-install dependencies.
- Page loads as a 404 - Make sure you are running in a folder with `mint.json`
