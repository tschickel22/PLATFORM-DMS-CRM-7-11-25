const [deal, setDeal] = useState({
    customer_name: deal?.customer_name || '',
    customer_email: deal?.customer_email || '',
    customer_phone: deal?.customer_phone || '',
    vehicle_info: deal?.vehicle_info || '',
    stage: deal?.stage || mockCrmSalesDeal.defaultDeal.stage,
    amount: deal?.amount || mockCrmSalesDeal.defaultDeal.amount,
    source: deal?.source || '',
    type: deal?.type || mockCrmSalesDeal.defaultDeal.type,
    priority: deal?.priority || mockCrmSalesDeal.defaultDeal.priority,
    probability: deal?.probability || mockCrmSalesDeal.defaultDeal.probability,
    rep_id: deal?.rep_id || '',
    rep_name: deal?.rep_name || '',
    expected_close_date: deal?.expected_close_date || mockCrmSalesDeal.defaultDeal.expectedCloseDate,
    notes: deal?.notes || ''
  })