import { LinkCard } from '../components/LinkCard';

const miscHooks = [
  {
    label: 'useCurrencies',
    description: `View all the ERC20 tokens supported by the Lens protocol.`,
    path: '/misc/useCurrencies',
  },
  {
    label: 'useNotifications',
    description: `View notifications for the active profile.`,
    path: '/misc/useNotifications',
  },
  {
    label: 'useUnreadNotificationCount',
    description: `View the total unread notification count for the active profile.`,
    path: '/misc/useUnreadNotificationCount',
  },
  {
    label: 'useApproveModule',
    description: `Approve a certain amount of an ERC20 Token to be used by a address`,
    path: '/misc/useApproveModule',
  },
  {
    label: 'useEnabledModules',
    description: `View all the modules supported by the Lens Protocol`,
    path: '/misc/useEnabledModules',
  },
  {
    label: 'useRecentTransactions',
    description: `Example of listing + clearing recent completed transactions.`,
    path: '/misc/useRecentTransactions',
  },
  {
    label: 'Polls',
    description: `Interact with publication containing a poll.`,
    path: '/misc/polls',
  },
];

export function MiscPage() {
  return (
    <div>
      <h1>Misc</h1>

      {miscHooks.map((link) => (
        <LinkCard key={link.path} {...link} />
      ))}
    </div>
  );
}
