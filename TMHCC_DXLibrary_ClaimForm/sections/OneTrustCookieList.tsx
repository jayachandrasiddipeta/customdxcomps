// Drop this on a dedicated Cookie Policy page/section — OneTrust renders the
// generated cookie list into it. Not used inside the claim form flow itself,
// which has no such page today.
function OneTrustCookieList() {
  return <div id='ot-sdk-cookie-policy'>&nbsp;</div>;
}

export default OneTrustCookieList;
