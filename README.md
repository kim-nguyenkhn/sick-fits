# sick-fits

"Sick Fits" is a full-stack online clothing store complete with real credit checkout. Built with React & GraphQL, and more.

## Getting Started

From two separate terminal instances, start the `frontend/` & `backend/` applications.

```shell
cd frontend
npm run dev
```

```shell
cd backend/
npm run dev
```

## Contributing/Making Changes

### Backend

Whenever you edit `datamodel.prisma`, you'll have to deploy that Prisma data model up to the Prisma service. 

```shell
npm run deploy
```

## Technologies



### Frontend
- React.js
  - Next.js (server-side rendering, routing, and tooling)
  - Styled Components
  - React-Apollo
- Apollo Client (Data management, GraphQL Queries & Mutations)
- Jest & Enzyme (testing)

### Backend
- GraphQL Yoga (Express GraphQL Server)
- Prisma (GraphQL DB Interface)

### Miscellaneous
- Cloudinary (CDN for image uploading and hosting)
- Mailtrap (SMTP server to emulate sending/receiving emails) 
