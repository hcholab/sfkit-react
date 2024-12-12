import React from "react";

interface TabNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  tabType: "workflow" | "config";
}

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, setActiveTab, tabType }) => {
  const workflowTabs = [
    { id: "data-mpcgwas", label: "MPC-GWAS workflow" },
    { id: "data-sfgwas", label: "SF-GWAS workflow" },
    { id: "data-sfpca", label: "SF-PCA workflow" },
    { id: "data-sfrelate", label: "SF-Relate workflow" },
    { id: "data-securedti", label: "Secure-DTI workflow" },
  ];

  const configTabs = [
    { id: "auto", label: "Automatic" },
    { id: "manual", label: "Manual" },
  ];

  const tabs = tabType === "workflow" ? workflowTabs : configTabs;

  return (
    <ul className="nav nav-tabs" role="tablist">
      {tabs.map((tab) => (
        <li className="nav-item" key={tab.id}>
          <button
            className={`nav-link ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => {
              console.log("Selected workflow tab:", tab);
              setActiveTab(tab.id);
            }}
            type="button"
          >
            {tab.label}
          </button>
        </li>
      ))}
    </ul>
  );
};

export default TabNavigation;
