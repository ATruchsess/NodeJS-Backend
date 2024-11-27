//ToDo: Alexander von Truchseß 27.11.2024

describe('Form Validation and Submission', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173/form') // Adjust the URL to your form route
  })

  it('Validates form fields', () => {
    cy.get('#formDataName').type('John Doe').should('have.value', 'John Doe')
    cy.get('button[type="submit"]').should('be.disabled')

    cy.get('#formDataPassword').type('short')
    cy.contains('Password must be at least 8 characters').should('exist')
  })

  it('Submits a valid form', () => {
    cy.get('#formDataName').type('John Doe')
    cy.get('#formDataPassword').type('password123')
    cy.get('button[type="submit"]').click()

    cy.contains('Submitting...').should('exist')
    cy.wait(2000) // Simulate API delay
    cy.contains('Submitting...').should('not.exist')
  })
})
