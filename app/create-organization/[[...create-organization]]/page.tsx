import { CreateOrganization } from "@clerk/nextjs";

export default function CreateOrganizationPage() {
  return (
    <>
      <div>Create Organization Page</div>
      <CreateOrganization
        path="/create-organization"
        afterCreateOrganizationUrl="/dashboard"
      />
    </>
  );
}
