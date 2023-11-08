import { useState } from "react";
import { Alert, Button } from "react-bootstrap";
import top_part from "../../static/images/top_part.png";
import bottom_part from "../../static/images/bottom_part.png";
import info_square from "../../static/images/info-square.svg";

interface GivePermissionsProps {
  demo?: boolean;
}

const GivePermissions: React.FC<GivePermissionsProps> = ({ demo }) => {
  const [collapse, setCollapse] = useState(false);
  const [buttonText, setButtonText] = useState("Copy");

  const handleMouseEnter = () => {
    setButtonText("Copy to Clipboard");
  };

  const handleMouseLeave = () => {
    setButtonText("Copy");
  };

  const handleCopy = () => {
    const copyText = document.getElementById("gcloud-command");
    if (copyText) {
      const textToCopy = (copyText.textContent || "").replace(/^\s+/gm, "");
      navigator.clipboard.writeText(textToCopy).then(
        () => {
          setButtonText("Copied!");
        },
        () => {
          console.error("Failure to copy. Check permissions for clipboard");
        }
      );
    } else {
      console.error("Could not find element with ID 'gcloud-command'");
    }
  };

  return (
    <div>
      {demo && (
        <Alert variant="info">
          <p className="mb-0">
            <img src={info_square} className="me-1 mb-1" width="20" height="20" alt="info-square" />
            This step can be skipped if you are following Tutorial 1 and using the default GCP Project.
          </p>
        </Alert>
      )}
      <div>
        <p>
          Log into{" "}
          <a
            href="https://console.cloud.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-decoration-none"
          >
            https://console.cloud.google.com
          </a>
          . Then click the icon in the top right to "Activate Cloud Shell". Once the Terminal is ready, please copy and
          run the following:
        </p>
        <div className="p-2 bg-light rounded">
          <Button
            id="copy-button"
            style={{ position: "relative", float: "right" }}
            variant="outline-secondary"
            size="sm"
            onClick={handleCopy}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {buttonText}
          </Button>
          <code id="gcloud-command" style={{ fontSize: "60%" }}>
            <div>gcloud iam roles create sfkitRole --project=$(gcloud config get-value project) \</div>
            <div>--title="sfkit Role $(gcloud config get-value project)" \</div>
            <div>
              --permissions=compute.disks.create,compute.firewalls.create,compute.firewalls.list,compute.firewalls.delete,\
            </div>
            <div>
              compute.firewallPolicies.create,compute.firewallPolicies.get,compute.instances.create,compute.instances.delete,compute.instances.get,\
            </div>
            <div>
              compute.instances.list,compute.instances.setMetadata,compute.instances.setServiceAccount,compute.instances.setTags,\
            </div>
            <div>
              compute.instances.stop,compute.networks.access,compute.networks.addPeering,compute.networks.create,\
            </div>
            <div>
              compute.networks.get,compute.networks.list,compute.networks.delete,compute.networks.removePeering,compute.networks.updatePolicy,\
            </div>
            <div>
              compute.subnetworks.create,compute.subnetworks.delete,compute.subnetworks.list,compute.subnetworks.use,\
            </div>
            <div>compute.subnetworks.useExternalIp,iam.serviceAccounts.actAs && \</div>
            <div>gcloud projects add-iam-policy-binding $(gcloud config get-value project) \</div>
            <div>--member=serviceAccount:419003787216-compute@developer.gserviceaccount.com \</div>
            <div>--role=projects/$(gcloud config get-value project)/roles/sfkitRole \</div>
            <div>
              --condition="title=Expiration,description=30 days,expression=request.time&lt;timestamp('$(date -u -d '+30
              days' +%Y-%m-%dT%H:%M:%S.000Z)')"
            </div>
          </code>
        </div>
        <br />
        <p>The console will ask for confirmation: type Y (for yes) and you're done.</p>
        <p className="text-muted">
          Note: If you've done this for your GCP project before (in the last 30 days), you can skip this step.
        </p>
        <p className="mt-3">
          <Button variant="secondary" size="sm" onClick={() => setCollapse((prev) => !prev)}>
            What is this command doing and why do we need it?
          </Button>
        </p>
        <div className={collapse ? "show" : "collapse"}>
          <div className="text-muted bg-light rounded">
            <div>
              <h4>Why do we need these permissions?</h4>
              <p>We want to run your protocol without access to your data.</p>
              <p>
                However, we still need <i>some</i> indirect to this account, so that we can set up a VM (virtual
                machine) to run protocol for you.
              </p>
              <p>
                And so, this is the single command that we need you to run to give us permission to set up a VM to run
                the protocol.
              </p>
            </div>
            <div>
              <h4>That shell command looks complicated though. What exactly is it doing?</h4>
              <p>
                The shell command is actually 2 commands put together. The first part creates a custom google IAM{" "}
                <a
                  href="https://cloud.google.com/iam/docs/understanding-roles"
                  target="_blank"
                  className="text-decoration-none"
                  rel="noopener noreferrer"
                >
                  role
                </a>{" "}
                that has permissions to set up a VM for the protocol.
              </p>
              <img className="img-fluid w-50" src={top_part} alt="" />
              <p className="mt-3">
                The second part assigns that role to this website (or, to be precise, to the Broad-managed GCP service
                account that runs this website).
              </p>
              <img className="img-fluid w-50" src={bottom_part} alt="" />
            </div>
            <div>
              <h4 className="mt-3">Okay. So what are all these permissions?</h4>
              <div>
                Let's go through the list, shall we?
                <ul>
                  <li>
                    <a
                      href="https://cloud.google.com/sdk/gcloud/reference/compute/disks/create"
                      target="_blank"
                      className="text-decoration-none"
                      rel="noopener noreferrer"
                    >
                      compute.disks.create
                    </a>{" "}
                    is needed to create a Compute Engine disk for the VM. This disk stores information such as the
                    operating system, and so is required to create the virtual machine.
                  </li>
                  <li>
                    <a
                      href="https://cloud.google.com/compute/docs/reference/rest/v1/firewalls/insert"
                      target="_blank"
                      className="text-decoration-none"
                      rel="noopener noreferrer"
                    >
                      compute.firewalls.create
                    </a>
                    ,
                    <a
                      href="https://cloud.google.com/compute/docs/reference/rest/v1/firewalls/list"
                      target="_blank"
                      className="text-decoration-none"
                      rel="noopener noreferrer"
                    >
                      compute.firewalls.list
                    </a>
                    ,
                    <a
                      href="https://cloud.google.com/sdk/gcloud/reference/compute/firewall-policies/rules/create"
                      target="_blank"
                      className="text-decoration-none"
                      rel="noopener noreferrer"
                    >
                      compute.firewallPolicies.create
                    </a>
                    , and
                    <a
                      href="https://cloud.google.com/compute/docs/reference/rest/v1/firewallPolicies/get"
                      target="_blank"
                      className="text-decoration-none"
                      rel="noopener noreferrer"
                    >
                      compute.firewallPolicies.get
                    </a>
                    are needed to set up the
                    <a
                      href="https://cloud.google.com/firewalls"
                      target="_blank"
                      className="text-decoration-none"
                      rel="noopener noreferrer"
                    >
                      firewall
                    </a>
                    rules for the VM so that it can interact with the other study participants' VMs during the protocol.
                  </li>
                  <li>
                    <a
                      href="https://cloud.google.com/sdk/gcloud/reference/compute/instances/create"
                      target="_blank"
                      className="text-decoration-none"
                      rel="noopener noreferrer"
                    >
                      compute.instances.create
                    </a>
                    ,
                    <a
                      href="https://cloud.google.com/sdk/gcloud/reference/compute/instances/delete"
                      target="_blank"
                      className="text-decoration-none"
                      rel="noopener noreferrer"
                    >
                      compute.instances.delete
                    </a>
                    ,
                    <a
                      href="https://cloud.google.com/compute/docs/reference/rest/v1/instances/get"
                      target="_blank"
                      className="text-decoration-none"
                      rel="noopener noreferrer"
                    >
                      compute.instances.get
                    </a>
                    ,
                    <a
                      href="https://cloud.google.com/sdk/gcloud/reference/compute/instances/list"
                      target="_blank"
                      className="text-decoration-none"
                      rel="noopener noreferrer"
                    >
                      compute.instances.list
                    </a>
                    ,
                    <a
                      href="https://cloud.google.com/compute/docs/reference/rest/v1/instances/setMetadata"
                      target="_blank"
                      className="text-decoration-none"
                      rel="noopener noreferrer"
                    >
                      compute.instances.setMetadata
                    </a>
                    ,
                    <a
                      href="https://cloud.google.com/compute/docs/reference/rest/v1/instances/setServiceAccount"
                      target="_blank"
                      className="text-decoration-none"
                      rel="noopener noreferrer"
                    >
                      compute.instances.setServiceAccount
                    </a>
                    ,
                    <a
                      href="https://cloud.google.com/compute/docs/reference/rest/v1/instances/setTags"
                      target="_blank"
                      className="text-decoration-none"
                      rel="noopener noreferrer"
                    >
                      compute.instances.setTags
                    </a>
                    , and
                    <a
                      href="https://cloud.google.com/sdk/gcloud/reference/compute/instances/stop"
                      target="_blank"
                      className="text-decoration-none"
                      rel="noopener noreferrer"
                    >
                      compute.instances.stop
                    </a>
                    are needed to set up the
                    <a
                      href="https://cloud.google.com/compute"
                      target="_blank"
                      className="text-decoration-none"
                      rel="noopener noreferrer"
                    >
                      virtual machine
                    </a>
                    . This includes creating it, setting the metadata associated with it, and so on.
                  </li>
                  <li>
                    compute.networks.access,
                    <a
                      href="https://cloud.google.com/compute/docs/reference/rest/v1/networks/addPeering"
                      target="_blank"
                      className="text-decoration-none"
                      rel="noopener noreferrer"
                    >
                      compute.networks.addPeering
                    </a>
                    ,
                    <a
                      href="https://cloud.google.com/sdk/gcloud/reference/compute/networks/create"
                      target="_blank"
                      className="text-decoration-none"
                      rel="noopener noreferrer"
                    >
                      compute.networks.create
                    </a>
                    ,
                    <a
                      href="https://cloud.google.com/compute/docs/reference/rest/v1/networks/get"
                      target="_blank"
                      className="text-decoration-none"
                      rel="noopener noreferrer"
                    >
                      compute.networks.get
                    </a>
                    ,
                    <a
                      href="https://cloud.google.com/sdk/gcloud/reference/compute/networks/list"
                      target="_blank"
                      className="text-decoration-none"
                      rel="noopener noreferrer"
                    >
                      compute.networks.list
                    </a>
                    ,
                    <a
                      href="https://cloud.google.com/compute/docs/reference/rest/v1/networks/removePeering"
                      target="_blank"
                      className="text-decoration-none"
                      rel="noopener noreferrer"
                    >
                      compute.networks.removePeering
                    </a>
                    , and compute.networks.updatePolicy are needed to set up the
                    <a
                      href="https://cloud.google.com/vpc/docs/vpc"
                      target="_blank"
                      className="text-decoration-none"
                      rel="noopener noreferrer"
                    >
                      VPC (Virtual Private Cloud) network
                    </a>
                    that the VM will be in. This includes
                    <a
                      href="https://cloud.google.com/vpc/docs/vpc-peering"
                      target="_blank"
                      className="text-decoration-none"
                      rel="noopener noreferrer"
                    >
                      VPC Network Peering
                    </a>
                    , which allows the VM to connect to the other study participants' VMs in a seamless fashion.
                  </li>
                  <li>
                    compute.subnetworks.create,
                    <a
                      href="https://cloud.google.com/compute/docs/reference/rest/v1/subnetworks/delete"
                      target="_blank"
                      className="text-decoration-none"
                      rel="noopener noreferrer"
                    >
                      compute.subnetworks.delete
                    </a>
                    ,
                    <a
                      href="https://cloud.google.com/compute/docs/reference/rest/v1/subnetworks/list"
                      target="_blank"
                      className="text-decoration-none"
                      rel="noopener noreferrer"
                    >
                      compute.subnetworks.list
                    </a>
                    , and compute.subnetworks.use, and compute.subnetworks.useExternalIp are needed to set up the
                    <a
                      href="https://cloud.google.com/vpc/docs/vpc#vpc_networks_and_subnets"
                      target="_blank"
                      className="text-decoration-none"
                      rel="noopener noreferrer"
                    >
                      subnet
                    </a>
                    that the VM will be in. This includes creating and using these subnets.
                  </li>
                  <li>
                    <a
                      href="https://cloud.google.com/iam/docs/service-accounts-actas"
                      target="_blank"
                      className="text-decoration-none"
                      rel="noopener noreferrer"
                    >
                      iam.serviceAccounts.actAs
                    </a>
                    is needed to act as a service account to do the various setup for the network and VM as described.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GivePermissions;
