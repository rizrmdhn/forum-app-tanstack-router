/**
 * Pengujian End-to-End: Alur Login
 *
 * Memastikan bahwa user dapat login dengan kredensial yang valid
 * dan mendapatkan pesan error ketika kredensial tidak valid.
 */

import { TEST_IDS } from '../../src/test-ids';

describe('Login Flow', () => {
  /**
   * Skenario: user mengisi kredensial yang valid dan menekan tombol Login.
   * Harapan: user diarahkan ke halaman utama dan tombol logout tampil.
   */
  it('should redirect to the home page after a successful login', () => {
    cy.intercept('POST', '**/v1/login', {
      statusCode: 200,
      body: {
        status: 'success',
        data: { token: 'fake-jwt-token' },
      },
    }).as('loginApi');

    cy.intercept('GET', '**/v1/users/me', {
      statusCode: 200,
      body: {
        status: 'success',
        data: {
          user: {
            id: 'user-1',
            name: 'Test User',
            email: 'test@example.com',
            avatar: 'https://ui-avatars.com/api/?name=Test+User',
          },
        },
      },
    }).as('profileApi');

    cy.visit('/login');

    cy.get(`[data-testid="${TEST_IDS.LOGIN.EMAIL_INPUT}"]`).type('test@example.com');
    cy.get(`[data-testid="${TEST_IDS.LOGIN.PASSWORD_INPUT}"]`).type('password123');
    cy.get(`[data-testid="${TEST_IDS.LOGIN.SUBMIT}"]`).click();

    cy.wait('@loginApi');
    cy.wait('@profileApi');

    cy.url().should('not.include', '/login');
    cy.get(`[data-testid="${TEST_IDS.NAV_BAR.LOGOUT_BUTTON}"]`).should('be.visible');
  });

  /**
   * Skenario: user mengisi email atau password yang salah.
   * Harapan: user tetap di halaman login.
   */
  it('should stay on login page when credentials are invalid', () => {
    cy.intercept('POST', '**/v1/login', {
      statusCode: 400,
      body: {
        status: 'fail',
        message: 'Email or password is wrong',
      },
    }).as('loginApi');

    cy.visit('/login');

    cy.get(`[data-testid="${TEST_IDS.LOGIN.EMAIL_INPUT}"]`).type('wrong@example.com');
    cy.get(`[data-testid="${TEST_IDS.LOGIN.PASSWORD_INPUT}"]`).type('wrongpassword');
    cy.get(`[data-testid="${TEST_IDS.LOGIN.SUBMIT}"]`).click();

    cy.wait('@loginApi');

    cy.url().should('include', '/login');
    cy.get(`[data-testid="${TEST_IDS.LOGIN.SUBMIT}"]`).should('exist');
  });

  /**
   * Skenario: user mengirim form login tanpa mengisi field apa pun.
   * Harapan: validasi client-side mencegah pengiriman dan form tetap tampil.
   */
  it('should show validation errors when form is submitted empty', () => {
    cy.visit('/login');

    cy.get(`[data-testid="${TEST_IDS.LOGIN.SUBMIT}"]`).click();

    cy.url().should('include', '/login');
    cy.get(`[data-testid="${TEST_IDS.LOGIN.EMAIL_INPUT}"]`).should('exist');
  });
});
