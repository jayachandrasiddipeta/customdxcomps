import type { ClaimFormData, UploadedAttachment } from '../types';

interface ReviewSectionProps {
  formData: ClaimFormData;
}

function ReviewField({ label, value }: { label: string; value: string }) {
  return (
    <div className='review-field'>
      <span className='review-field__label'>{label}</span>
      <span className='review-field__value'>{value || '—'}</span>
    </div>
  );
}

function ReviewBlock({ title, stepNum, children }: { title: string; stepNum: number; children: React.ReactNode }) {
  return (
    <section className='claim-form__section'>
      <h3 className='claim-form__section-title'>
        <span className='claim-form__section-index'>{stepNum}</span>
        {title}
      </h3>
      <div className='review-grid'>{children}</div>
    </section>
  );
}

function ReviewSection({ formData }: ReviewSectionProps) {
  return (
    <div>
      <ReviewBlock title='Your Details' stepNum={1}>
        <ReviewField label='First Name' value={formData.firstName} />
        <ReviewField label='Last Name' value={formData.lastName} />
        <ReviewField label='Email' value={formData.email} />
        <ReviewField label='Phone Number' value={formData.phoneNumber} />
        <ReviewField label='Policy Number' value={formData.policyNumber} />
        <ReviewField label='Membership Number' value={formData.membershipNumber} />
        <ReviewField label='Service Number' value={formData.serviceNumber} />
        <ReviewField label='Scheme / Product' value={formData.schemeOrProduct} />
      </ReviewBlock>

      <ReviewBlock title='What Happened' stepNum={2}>
        <ReviewField label='Relationship to Policyholder' value={formData.relationship} />
        <ReviewField label='Date of Loss' value={formData.dateOfLoss} />
        <ReviewField label='Loss Type' value={formData.lossType} />
        <ReviewField label='Cause of Loss' value={formData.causeOfLoss} />
        <ReviewField label='Country' value={formData.lossCountry} />
        <ReviewField label='Address Line 1' value={formData.lossAddressLine1} />
        <ReviewField label='Address Line 2' value={formData.lossAddressLine2} />
        <ReviewField label='City / Town' value={formData.lossCity} />
        <ReviewField label='Postal Code' value={formData.lossPostalCode} />
        <div className='review-field review-field--full'>
          <span className='review-field__label'>Description</span>
          <span className='review-field__value'>{formData.description || '—'}</span>
        </div>
      </ReviewBlock>

      <ReviewBlock title='Items Affected' stepNum={3}>
        <ReviewField label='Type of Item' value={formData.itemType} />
        <ReviewField label='Item Description' value={formData.itemDescription} />
        <ReviewField label='Purchase Price (£)' value={formData.purchasePrice} />
        <ReviewField label='Claimed Amount (£)' value={formData.claimedAmount} />
        <ReviewField label='Country' value={formData.policyCountry} />
        <ReviewField label='Address Line 1' value={formData.policyAddressLine1} />
        <ReviewField label='Address Line 2' value={formData.policyAddressLine2} />
        <ReviewField label='City / Town' value={formData.policyCity} />
        <ReviewField label='Postal Code' value={formData.policyPostalCode} />
      </ReviewBlock>

      <ReviewBlock title='Supporting Evidence' stepNum={4}>
        <div className='review-field review-field--full'>
          <span className='review-field__label'>Uploaded Files</span>
          {formData.attachments.length > 0 ? (
            <ul className='review-field__file-list'>
              {formData.attachments.map((a: UploadedAttachment) => (
                <li key={a.id}>{a.name}</li>
              ))}
            </ul>
          ) : (
            <span className='review-field__value'>No files uploaded</span>
          )}
        </div>
        <ReviewField label='Declaration confirmed' value={formData.hasUserConfirmed ? 'Yes' : 'No'} />
      </ReviewBlock>
    </div>
  );
}

export default ReviewSection;
