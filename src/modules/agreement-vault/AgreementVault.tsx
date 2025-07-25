export default function AgreementVault() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState('agreements')
  
  const {
    agreements,
    templates,
    signatures,
    loading,
    createAgreement,
    updateAgreement,
    deleteAgreement
  } = useAgreementVault()

  return (
    <Routes>
      <Route path="/" element={<AgreementVaultDashboard />} />
      <Route path="/*" element={<AgreementVaultDashboard />} />
    </Routes>
  )
}